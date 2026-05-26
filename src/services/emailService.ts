// Environment variables (Next.js .env):
// NEXT_PUBLIC_EMAILJS_SERVICE_ID
// NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
// NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ''
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? 'service_r4l1kgt'
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''

// Use dynamic import to avoid SSR bundling/import errors in Next.js
export async function sendEmail({
  name,
  email,
  message,
  serviceId = SERVICE_ID,
  templateId = TEMPLATE_ID,
}: {
  name: string
  email: string
  message: string
  serviceId?: string
  templateId?: string
}) {
  const missingKeys = []
  if (!PUBLIC_KEY) missingKeys.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY')
  if (!serviceId) missingKeys.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID')
  if (!templateId) missingKeys.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID')

  if (missingKeys.length > 0) {
    throw new Error(
      `EmailJS not configured. Missing env: ${missingKeys.join(', ')}. ` +
        'Copy values into .env.local and restart the dev server.',
    )
  }

  const templateParams = {
    name,
    email,
    message,
  }

  try {
    const emailjsModule = await import('@emailjs/browser')
    const emailjs = (emailjsModule && (emailjsModule.default ?? emailjsModule)) as any

    try {
      if (PUBLIC_KEY && typeof emailjs.init === 'function') emailjs.init(PUBLIC_KEY)
    } catch (e) {
      // ignore init errors
    }

    const result = await emailjs.send(serviceId, templateId, templateParams, PUBLIC_KEY)
    return result
  } catch (error) {
    throw error
  }
}
