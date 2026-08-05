import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

/**
 * Genera una URL firmada de corta duración para descargar un archivo sensible.
 * Evita la exposición pública de exámenes o certificados médicos.
 * @param fileName Nombre del archivo en el servidor
 * @param durationMinutes Tiempo de validez en minutos (ej: 2)
 */
export const generateSignedUrl = (fileName: string, durationMinutes: number = 2): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET no configurado");
  const expires = Date.now() + durationMinutes * 60 * 1000;
  
  // Crear firma criptográfica HMAC SHA256
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${fileName}:${expires}`);
  const signature = hmac.digest("hex");

  const backendUrl = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 3040}`;
  return `${backendUrl}/api/n8n/download-secured?file=${encodeURIComponent(fileName)}&expires=${expires}&signature=${signature}`;
};

/**
 * Valida la autenticidad y vigencia de una URL firmada.
 */
export const verifySignedUrl = (fileName: string, expires: string, signature: string): boolean => {
  const expirationTime = parseInt(expires);
  if (isNaN(expirationTime) || expirationTime < Date.now()) {
    console.warn("⚠️ Intento de descarga con URL firmada expirada.");
    return false;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET no configurado");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${fileName}:${expires}`);
  const expectedSignature = hmac.digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

/**
 * Dispara un evento hacia el Webhook de n8n
 */
export const triggerN8nWebhook = async (webhookUrl: string | undefined, payload: any) => {
  if (!webhookUrl) {
    console.log("⚠️ Webhook de n8n no configurado. Saltando evento.");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-n8n-secret': process.env.N8N_WEBHOOK_SECRET || ''
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`✅ Evento enviado a n8n exitosamente: ${webhookUrl}`);
    } else {
      console.error(`❌ Error de n8n: Respondió con código ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Error de red conectando con n8n:", error);
  }
};

/**
 * Dispara un evento unificado al Bus de Eventos de n8n, aplicando firmas de seguridad a los adjuntos.
 */
export const triggerUnifiedWebhook = async (
  eventType: "TICKET" | "RESERVATION" | "LOAN" | "PROCUREMENT" | "MAINTENANCE" | "JUSTIFICATION" | "PRINT_REQUESTED",
  id: string,
  userName: string,
  userEmail: string,
  title: string,
  description: string,
  laboratory: string | null,
  extraDetails: any = {},
  attachmentFileName?: string
) => {
  let attachmentUrl = null;
  if (attachmentFileName) {
    // Genera URL firmada criptográficamente por 5 minutos
    attachmentUrl = generateSignedUrl(attachmentFileName, 5);
  }

  const payload = {
    eventType,
    id,
    userName,
    userEmail,
    title,
    description,
    laboratory,
    timestamp: new Date().toISOString(),
    extraDetails,
    attachmentUrl
  };

  const webhookUrl = process.env.N8N_WEBHOOK_UNIFIED || process.env.N8N_WEBHOOK_TICKETS;
  await triggerN8nWebhook(webhookUrl, payload);
};

