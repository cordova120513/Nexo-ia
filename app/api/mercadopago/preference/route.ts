import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Clave de cuenta de destino / payout para NEXO.IA
export const MERCADOPAGO_PAYOUT_ACCOUNT_ID = '5428780117367250';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { 
      planId = 'plan_pyme_pro',
      planTitle = 'Suscripción NEXO.IA Plan Pyme Pro',
      amount = 2500,
      userEmail = 'cliente@pyme.com',
      companyName = 'Pyme',
    } = body;

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Si no hay access token real o está con placeholder, retornar preferencia simulada segura
    if (!accessToken || accessToken.includes('tu-access-token') || accessToken.startsWith('APP_USR-tu')) {
      console.log(`[Mercado Pago] Configuración de enrutamiento a cuenta payout: ${MERCADOPAGO_PAYOUT_ACCOUNT_ID}`);
      return NextResponse.json({
        id: `mock_pref_${Date.now()}`,
        init_point: `${origin}/dashboard?payment_status=approved&plan=${encodeURIComponent(planId)}&account=${MERCADOPAGO_PAYOUT_ACCOUNT_ID}`,
        sandbox_init_point: `${origin}/dashboard?payment_status=approved&plan=${encodeURIComponent(planId)}&account=${MERCADOPAGO_PAYOUT_ACCOUNT_ID}`,
        payout_account: MERCADOPAGO_PAYOUT_ACCOUNT_ID,
        is_mock: true,
      });
    }

    const client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 8000 },
    });

    const preference = new Preference(client);

    const preferenceData = {
      body: {
        items: [
          {
            id: planId,
            title: `${planTitle} - ${companyName}`,
            quantity: 1,
            unit_price: Number(amount),
            currency_id: 'MXN',
            description: `Plataforma SaaS NEXO.IA para ${companyName}. Enrutado a cuenta ${MERCADOPAGO_PAYOUT_ACCOUNT_ID}`,
          },
        ],
        // Enrutamiento de recaudación y vinculación de payout
        sponsor_id: 5428780117367250,
        metadata: {
          account_id: MERCADOPAGO_PAYOUT_ACCOUNT_ID,
          payout_destination: MERCADOPAGO_PAYOUT_ACCOUNT_ID,
          client_email: userEmail,
          company: companyName,
        },
        payer: {
          email: userEmail,
        },
        back_urls: {
          success: `${origin}/dashboard?payment_status=approved&plan=${encodeURIComponent(planId)}`,
          failure: `${origin}/?payment_status=failure`,
          pending: `${origin}/dashboard?payment_status=pending`,
        },
        auto_return: 'approved',
      },
    };

    const result = await preference.create(preferenceData);

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      payout_account: MERCADOPAGO_PAYOUT_ACCOUNT_ID,
      is_mock: false,
    });
  } catch (error: any) {
    console.error('[Mercado Pago API Error]:', error);
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.json({
      id: `fallback_${Date.now()}`,
      init_point: `${origin}/dashboard?payment_status=approved&plan=pyme_pro`,
      payout_account: MERCADOPAGO_PAYOUT_ACCOUNT_ID,
      error: error?.message || 'Error creating Mercado Pago preference',
    });
  }
}
