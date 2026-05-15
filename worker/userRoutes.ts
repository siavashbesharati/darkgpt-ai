import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const userId = c.req.header('X-User-Id');
            if (!userId) return c.json({ success: false, error: 'Unauthorized' }, 401);
            const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
            const url = new URL(c.req.url);
            url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
            // Pass user id to agent
            const newReq = new Request(url.toString(), {
                method: c.req.method,
                headers: { ...c.req.header(), 'X-User-Id': userId },
                body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
            });
            return agent.fetch(newReq);
        } catch (error) {
            return c.json({ success: false, error: API_RESPONSES.AGENT_ROUTING_FAILED }, 500);
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.post('/api/auth/send-otp', async (c) => {
        const { email } = await c.req.json();
        const controller = getAppController(c.env);
        const code = await controller.createOTP(email);
        console.log(`[MOCK EMAIL] To: ${email}, Code: ${code}`);
        return c.json({ success: true, message: 'OTP sent to email (Mocked in logs)' });
    });
    app.post('/api/auth/verify-otp', async (c) => {
        const { email, code } = await c.req.json();
        const controller = getAppController(c.env);
        const user = await controller.verifyOTP(email, code);
        if (!user) return c.json({ success: false, error: 'Invalid or expired OTP' }, 400);
        return c.json({ success: true, data: { user, token: user.id } });
    });
    app.get('/api/auth/me', async (c) => {
        const userId = c.req.header('Authorization');
        if (!userId) return c.json({ success: false, error: 'No token' }, 401);
        const controller = getAppController(c.env);
        const user = await controller.getUser(userId);
        if (!user) return c.json({ success: false, error: 'User not found' }, 404);
        return c.json({ success: true, data: user });
    });
    app.get('/api/admin/settings', async (c) => {
        const controller = getAppController(c.env);
        return c.json({ success: true, data: await controller.getSettings() });
    });
    app.post('/api/admin/settings', async (c) => {
        const settings = await c.req.json();
        const controller = getAppController(c.env);
        await controller.updateSettings(settings);
        return c.json({ success: true });
    });
    app.post('/api/upgrade', async (c) => {
        const userId = c.req.header('Authorization');
        const { tier, credits } = await c.req.json();
        if (!userId) return c.json({ success: false, error: 'Unauthorized' }, 401);
        const controller = getAppController(c.env);
        await controller.upgradeUser(userId, tier, credits);
        return c.json({ success: true });
    });
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        return c.json({ success: true, data: await controller.listSessions() });
    });
}