import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { adminRequest } from "../providers/dataProvider";

type Status = {
  ai: { enabled: boolean; updatedAt: string | null; endpointConfigured: boolean; tokenConfigured: boolean };
  telegram: { botConfigured: boolean; chatConfigured: boolean; webhookSecretConfigured: boolean; ready: boolean };
  notifications: { outbox: { status: string; total: number }[]; lastFailure: { event_type: string; failed_at: string } | null };
  security: { activeAdminAccounts: number; currentUser: { username: string; role: string } };
};
function State({ label, ok }: { label: string; ok: boolean }) {
  return <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ py: 1 }}>
    <Typography>{label}</Typography><Chip size="small" label={ok ? "Configured" : "Missing"} color={ok ? "success" : "warning"} variant="outlined"/>
  </Stack>;
}
export function SettingsPage() {
  const [data, setData] = useState<Status | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    adminRequest("/admin/settings").then(result => { if (active) setData(result.data); })
      .catch(() => { if (active) setError("Settings status could not be loaded. Refresh the page to try again."); });
    return () => { active = false; };
  }, []);
  if (!data && !error) return <Box sx={{ p: 4 }}><CircularProgress size={26}/></Box>;
  return <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100 }}>
    <Typography variant="h4" sx={{ mb: 1 }}>Settings & system status</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Read-only configuration checks. Secrets are never displayed here.</Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {data && <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent>
        <Typography variant="h6">AI service</Typography>
        <State label="Automatic replies" ok={data.ai.enabled}/>
        <State label="AI endpoint" ok={data.ai.endpointConfigured}/>
        <State label="AI access token" ok={data.ai.tokenConfigured}/>
        {data.ai.updatedAt && <Typography variant="caption" color="text.secondary">Last setting update: {new Date(data.ai.updatedAt).toLocaleString()}</Typography>}
      </CardContent></Card></Grid>
      <Grid size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent>
        <Typography variant="h6">Telegram</Typography>
        <State label="Bot token" ok={data.telegram.botConfigured}/>
        <State label="Support chat ID" ok={data.telegram.chatConfigured}/>
        <State label="Webhook secret" ok={data.telegram.webhookSecretConfigured}/>
        <Alert severity={data.telegram.ready ? "success" : "warning"} sx={{ mt: 1 }}>{data.telegram.ready ? "Telegram environment configuration is present." : "Telegram configuration is incomplete. Add missing values in Worker secrets/variables."}</Alert>
      </CardContent></Card></Grid>
      <Grid size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent>
        <Typography variant="h6">Notification delivery</Typography>
        {(data.notifications.outbox || []).length ? data.notifications.outbox.map(item => <State key={item.status} label={`${item.status} notifications`} ok={item.status === "sent" || item.total === 0}/>) : <Typography color="text.secondary" sx={{ mt: 1 }}>No queued notifications.</Typography>}
        {data.notifications.lastFailure && <Alert severity="warning" sx={{ mt: 2 }}>Last Telegram delivery failure: {data.notifications.lastFailure.event_type} · {new Date(data.notifications.lastFailure.failed_at).toLocaleString()}</Alert>}
      </CardContent></Card></Grid>
      <Grid size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent>
        <Typography variant="h6">Admin security</Typography>
        <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}><Typography>Signed in as</Typography><Typography fontWeight={700}>{data.security.currentUser.username}</Typography></Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}><Typography>Role</Typography><Chip size="small" label={data.security.currentUser.role}/></Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}><Typography>Active admin accounts</Typography><Typography fontWeight={700}>{data.security.activeAdminAccounts}</Typography></Stack>
        <Typography variant="caption" color="text.secondary">Administrative actions are recorded in Activity. Account creation, role changes and credential resets are not exposed in this dashboard.</Typography>
      </CardContent></Card></Grid>
    </Grid>}
  </Box>;
}
