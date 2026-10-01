import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { messages, contextData, systemPrompt: customPrompt } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const empresaNombre = contextData?.empresa || 'la Pyme';
    const ventasTotales = contextData?.totalIngresos ?? 0;
    const mermasTotales = contextData?.totalMermas ?? 0;
    const balanceNeto = contextData?.balanceNeto ?? 0;
    const gastosFixed = contextData?.gastosFijos ?? 0;
    const utilidadNeta = balanceNeto - gastosFixed;

    const productosInfo = contextData?.productos?.length
      ? contextData.productos
          .map((p: any) =>
            `• ${p.nombre} | Precio: $${p.precio} MXN | Costo: $${p.costo} MXN | Stock: ${p.stock} uds${p.stockMinimo ? ` (Mín: ${p.stockMinimo})` : ''}`
          )
          .join('\n')
      : 'Sin productos registrados.';

    const ventasDetalle = contextData?.ventas?.length
      ? contextData.ventas
          .slice(0, 10)
          .map((v: any) => `• ${v.productoNombre} x${v.cantidad} — $${v.montoTotal} MXN — ${v.fechaHora || v.fecha}`)
          .join('\n')
      : 'Sin ventas registradas.';

    const mermasDetalle = contextData?.mermas?.length
      ? contextData.mermas
          .slice(0, 8)
          .map((m: any) => `• ${m.productoNombre} x${m.cantidad} — -$${m.costoDevaluacion} MXN — ${m.motivo}`)
          .join('\n')
      : 'Sin mermas registradas.';

    const systemPrompt = customPrompt || `Eres el Asesor Analítico Estratégico de NEXO.IA para la empresa "${empresaNombre}".
Tu misión: proporcionar asesoría táctica concreta, números exactos y recomendaciones de acción inmediata para maximizar la rentabilidad y reducir pérdidas.

DATOS ACTUALIZADOS DEL NEGOCIO:
- Ingresos totales: $${ventasTotales} MXN
- Pérdidas por mermas: -$${mermasTotales} MXN
- Balance neto (ventas - mermas): $${balanceNeto} MXN
- Gastos fijos registrados: -$${gastosFixed} MXN
- Utilidad neta real: $${utilidadNeta} MXN

INVENTARIO (${contextData?.productos?.length || 0} productos):
${productosInfo}

ULTIMAS VENTAS:
${ventasDetalle}

ULTIMAS MERMAS:
${mermasDetalle}

INSTRUCCIONES CRITICAS:
1. Detecta el tipo de consulta:
   - DATOS PUROS ("cuanto vendi", "cual es mi balance"): responde SOLO con los numeros exactos del contexto.
   - CONSEJO/ESTRATEGIA ("como mejoro", "que hago"): 2-3 recomendaciones concretas basadas en datos reales.
   - MIXTA: primero datos, luego maximo 1 recomendacion.
2. Maximo 5 oraciones. Sin saludos repetitivos.
3. Usa numeros EXACTOS del contexto. No inventes cifras.
4. Responde en espanol. Tono: consultor senior pragmatico y directo.
5. Si no hay datos, dilo en 1 oracion y sugiere que registrar.`;

    if (!apiKey) {
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
      const isData = /cuánto|cuál|cuales|cuántos|balance|total|ingresos|ventas|mermas|stock|precio|productos/i.test(lastMsg);
      const isStrategy = /cómo|qué hago|recomend|mejorar|aumentar|reducir|ayúdame|consejo|idea|estrategia|sugiere/i.test(lastMsg);

      let reply = '';
      if (isData && !isStrategy) {
        if (/venta|ingreso/.test(lastMsg)) {
          reply = `**Ingresos de ${empresaNombre}:** $${ventasTotales} MXN en ${contextData?.ventas?.length || 0} ventas.\n\n**Últimas ventas:**\n${ventasDetalle}`;
        } else if (/merma|pérdida/.test(lastMsg)) {
          reply = `**Mermas registradas:** -$${mermasTotales} MXN.\n\n**Detalle:**\n${mermasDetalle}`;
        } else if (/balance|ganancia|neta/.test(lastMsg)) {
          reply = `**Balance de ${empresaNombre}:**\n• Ingresos: $${ventasTotales} MXN\n• Mermas: -$${mermasTotales} MXN\n• Gastos fijos: -$${gastosFixed} MXN\n• **Utilidad neta real: $${utilidadNeta} MXN**`;
        } else {
          reply = `**Catálogo de ${empresaNombre}** (${contextData?.productos?.length || 0} productos):\n${productosInfo}`;
        }
      } else if (isStrategy) {
        const bajoStock = contextData?.productos?.filter((p: any) => p.stock < (p.stockMinimo || 5)) || [];
        const margen = contextData?.productos?.length
          ? Math.round(contextData.productos.reduce((a: number, p: any) => a + (p.precio - p.costo), 0) / contextData.productos.length)
          : 0;
        reply = `**Análisis estratégico para ${empresaNombre}:**\n1. Utilidad neta actual: **$${utilidadNeta} MXN** — margen promedio por producto: $${margen} MXN.\n2. ${bajoStock.length ? `**${bajoStock.length} producto(s) con stock bajo** — genera una orden de compra antes de agotar stock.` : 'Inventario bien abastecido.'}\n3. Activa promociones con IA para productos de baja rotación y envíalas por WhatsApp para rotar inventario rápidamente.`;
      } else {
        reply = `**${empresaNombre}** — Resumen actual:\n• Ingresos: $${ventasTotales} | Mermas: -$${mermasTotales} | Utilidad neta: $${utilidadNeta} MXN\n• Productos: ${contextData?.productos?.length || 0}\n\n¿Qué necesitas analizar: ventas, mermas, inventario o estrategia?`;
      }
      return NextResponse.json({ role: 'assistant', content: reply });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const contents = messages
      .filter((m: any) => m.id !== 'welcome')
      .map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const result = await model.generateContent({
      contents,
      generationConfig: { maxOutputTokens: 700, temperature: 0.65, topP: 0.92 },
    });

    return NextResponse.json({ role: 'assistant', content: result.response.text() });
  } catch (error: any) {
    console.error('Error en Gemini Chat API:', error);
    return NextResponse.json(
      { role: 'assistant', content: 'Hubo una interrupción al conectar con el motor neuronal de Gemini. Por favor intenta de nuevo.' },
      { status: 200 }
    );
  }
}
