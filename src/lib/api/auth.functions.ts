import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authenticateUser, generateSessionToken, validateSessionToken } from "../auth.server";

// ============================================
// LOGIN
// ============================================
export const loginUser = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      username: z.string().min(1).max(50),
      password: z.string().min(1).max(100),
    })
  )
  .handler(async ({ data }) => {
    // Validação e autenticação com proteção contra SQL injection
    const { username, password } = data;

    // Simular delay para evitar brute force (200-300ms)
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 200));

    if (!authenticateUser(username, password)) {
      return {
        success: false,
        message: "Usuário ou senha incorretos",
        token: null,
      };
    }

    // Gerar token de sessão
    const token = generateSessionToken(username);

    return {
      success: true,
      message: "Login realizado com sucesso",
      token,
    };
  });

// ============================================
// VERIFICAR SESSÃO
// ============================================
export const verifySession = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { valid, username } = validateSessionToken(data.token);

    return {
      valid,
      username,
    };
  });

// ============================================
// LOGOUT
// ============================================
export const logoutUser = createServerFn({ method: "POST" })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    // Token é invalidado no cliente (sessionStorage)
    // Aqui apenas confirmamos o logout
    return {
      success: true,
      message: "Logout realizado com sucesso",
    };
  });
