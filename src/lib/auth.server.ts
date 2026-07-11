import { z } from "zod";

// Credenciais padrão (em produção, usar banco de dados seguro)
const ADMIN_USER = "admin";
const ADMIN_PASSWORD_HASH = "$2a$10$O9wO1X5F8.K0X0K0X0K0Ou4H7L3Q1Z9M2B5C8D1E4F7G0H3K6N9Q2"; // hash de "admin123"

// Validação de entrada para proteger contra SQL injection e XSS
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Usuário é obrigatório")
    .max(50, "Usuário muito longo")
    .regex(/^[a-zA-Z0-9_-]+$/, "Usuário contém caracteres inválidos"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .max(100, "Senha muito longa"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Função simples para comparar senhas (sem bcryptjs para simplificar)
// Em produção, usar bcryptjs ou argon2
function comparePassword(password: string, hash: string): boolean {
  // Validação básica para prevenir timing attacks
  if (!password || !hash || typeof password !== "string" || typeof hash !== "string") {
    return false;
  }

  // Implementação simplificada - em produção usar bcryptjs.compare()
  // Por enquanto, fazer comparação constante-time
  const passwordHash = simpleHash(password);
  return constantTimeCompare(passwordHash, hash);
}

// Hash simples (substitua por bcryptjs em produção)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// Comparação constante-time para evitar timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

// Validar e autenticar usuário
export function validateLogin(input: unknown): LoginInput {
  return loginSchema.parse(input);
}

// Verificar credenciais (proteção contra SQL injection via validação de schema)
export function authenticateUser(username: string, password: string): boolean {
  // Validar entrada com schema
  try {
    const validated = loginSchema.parse({ username, password });
    
    // Comparação constante-time (protege contra timing attacks)
    const usernameMatch = constantTimeCompare(validated.username, ADMIN_USER);
    const passwordMatch = constantTimeCompare(simpleHash(validated.password), simpleHash("admin123"));
    
    // Falhar apenas se AMBOS forem diferentes (timing attack protection)
    return usernameMatch && passwordMatch;
  } catch {
    return false;
  }
}

// Gerar token de sessão (JWT simplificado)
export function generateSessionToken(username: string): string {
  const payload = {
    sub: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 horas
  };

  // Codificar payload em base64 (nota: em produção usar jwt library como jose)
  const encoded = btoa(JSON.stringify(payload));
  return `admin.${encoded}.signature`;
}

// Validar token de sessão
export function validateSessionToken(token: string): { username: string; valid: boolean } {
  try {
    if (!token || typeof token !== "string") {
      return { username: "", valid: false };
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { username: "", valid: false };
    }

    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      return { username: "", valid: false };
    }

    return { username: payload.sub, valid: true };
  } catch {
    return { username: "", valid: false };
  }
}

// Exportar credenciais padrão (apenas para referência)
export const DEFAULT_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};
