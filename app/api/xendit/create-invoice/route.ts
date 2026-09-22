import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, description, payerEmail, items, customerName } = body;

    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "XENDIT_SECRET_KEY tidak ditemukan di environment.",
          fallbackInvoiceId: `INV-SIM-${Date.now()}`,
        },
        { status: 200 }
      );
    }

    const authHeader = "Basic " + Buffer.from(`${secretKey}:`).toString("base64");
    const externalId = `INV-JVQ-${Date.now()}`;

    const payload = {
      external_id: externalId,
      amount: Math.round(Number(amount) || 0),
      description: description || "Pembelian Koleksi Jovique Official",
      invoice_duration: 86400, // 24 jam
      payer_email: payerEmail || undefined,
      customer: customerName ? { given_names: customerName } : undefined,
      items: items && Array.isArray(items)
        ? items.map((it) => ({
            name: it.name,
            quantity: it.quantity,
            price: Math.round(it.price),
            category: it.category || "Fashion",
          }))
        : undefined,
      currency: "IDR",
    };

    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("Panggilan Xendit Sandbox gagal:", data);
      return NextResponse.json(
        {
          success: false,
          fallbackInvoiceId: externalId,
          error: data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice: {
        id: data.id,
        external_id: data.external_id,
        invoice_url: data.invoice_url,
        status: data.status,
        amount: data.amount,
        expiry_date: data.expiry_date,
        available_banks: data.available_banks,
        available_ewallets: data.available_ewallets,
        available_qr_codes: data.available_qr_codes,
      },
    });
  } catch (error) {
    console.error("Error pada API create-invoice Xendit:", error);
    return NextResponse.json(
      {
        success: false,
        fallbackInvoiceId: `INV-SIM-${Date.now()}`,
        error: error instanceof Error ? error.message : "Terjadi kesalahan internal",
      },
      { status: 500 }
    );
  }
}
