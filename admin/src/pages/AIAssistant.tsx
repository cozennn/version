import { useEffect, useState } from "react";
import { usePermissions } from "react-admin";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { adminRequest } from "../providers/dataProvider";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function AIAssistantPage() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { permissions } = usePermissions();
  const canUseAdminAI = permissions === "owner" || permissions === "admin";

  useEffect(() => {
    let active = true;
    adminRequest("/admin/ai/settings")
      .then(result => { if (active) setEnabled(result.data?.enabled !== false); })
      .catch(() => { if (active) setError("Could not load AI settings. Please refresh and try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function updateEnabled(next: boolean) {
    setSaving(true);
    setError("");
    try {
      const result = await adminRequest("/admin/ai/settings", {
        method: "POST",
        body: JSON.stringify({ enabled: next })
      });
      setEnabled(result.data?.enabled === true);
    } catch {
      setError("The setting could not be saved. Your previous setting is unchanged.");
    } finally {
      setSaving(false);
    }
  }

  async function sendQuestion() {
    const message = question.trim();
    if (!message || sending) return;
    setQuestion("");
    setMessages(current => [...current, { role: "user", content: message }]);
    setSending(true);
    setError("");
    try {
      const result = await adminRequest("/admin/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message })
      });
      setMessages(current => [...current, { role: "assistant", content: result.data?.answer || "No answer was returned." }]);
    } catch (reason) {
      const detail = reason instanceof Error ? reason.message : "AI is temporarily unavailable.";
      setError(detail === "ai_temporarily_unavailable"
        ? "The free AI allowance may be exhausted, or Cloudflare is temporarily unavailable. Try again later."
        : detail);
    } finally {
      setSending(false);
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 980 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>AI Assistant</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Customer-support automation and read-only business analysis, powered by Cloudflare Workers AI.
      </Typography>
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
            <Box>
              <Typography variant="h6">Automatic customer replies</Typography>
              <Typography color="text.secondary" variant="body2">
                {enabled ? "AI can reply to visitor messages while a ticket remains in AI mode." : "Automatic AI replies are disabled. Visitors can still request a human agent."}
              </Typography>
            </Box>
            {loading ? <CircularProgress size={24} /> : (
              <FormControlLabel
                control={<Switch checked={enabled} disabled={saving} onChange={event => void updateEnabled(event.target.checked)} />}
                label={enabled ? "Enabled" : "Disabled"}
                labelPlacement="start"
              />
            )}
          </Stack>
          {saving && <Typography variant="caption" color="text.secondary">Saving setting…</Typography>}
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 2 }}>
        Free-plan protection: this integration uses Cloudflare Workers AI only. Cloudflare rejects further AI inference after the free daily allocation is exhausted. NorDa does not retry through a paid provider or upgrade your plan. The AI may be unavailable until the allowance resets.
      </Alert>

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">NorDa business assistant</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            Ask about order totals, product status, payment status, revenue by currency, and support-ticket counts. The assistant receives aggregate data only and cannot edit records.
          </Typography>
          {!canUseAdminAI ? (
            <Alert severity="warning">Business analysis is available to owner and admin accounts only.</Alert>
          ) : (
            <>
              <Paper variant="outlined" sx={{ p: 2, minHeight: 190, maxHeight: 430, overflowY: "auto", mb: 2, bgcolor: "background.default" }}>
                {messages.length === 0 ? (
                  <Typography color="text.secondary" variant="body2">
                    Example: “Summarize our current orders and identify the main support workload.”
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {messages.map((item, index) => (
                      <Box key={index} sx={{ alignSelf: item.role === "user" ? "flex-end" : "flex-start", maxWidth: "92%" }}>
                        <Typography variant="caption" color="text.secondary">{item.role === "user" ? "You" : "NorDa AI"}</Typography>
                        <Paper sx={{ p: 1.5, whiteSpace: "pre-wrap", bgcolor: item.role === "user" ? "action.selected" : "background.paper" }} variant="outlined">
                          <Typography variant="body2">{item.content}</Typography>
                        </Paper>
                      </Box>
                    ))}
                    {sending && <Stack direction="row" alignItems="center" spacing={1}><CircularProgress size={16}/><Typography variant="caption" color="text.secondary">Analyzing aggregate data…</Typography></Stack>}
                  </Stack>
                )}
              </Paper>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  size="small"
                  value={question}
                  disabled={sending}
                  onChange={event => setQuestion(event.target.value)}
                  onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendQuestion(); } }}
                  placeholder="Ask NorDa AI about your business…"
                />
                <Button variant="contained" endIcon={<SendRoundedIcon />} disabled={!question.trim() || sending} onClick={() => void sendQuestion()}>
                  {sending ? "Thinking" : "Send"}
                </Button>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
      <Divider sx={{ my: 3 }} />
      <Alert severity="info">
        Human handoff is independent of the automatic-replies switch. Once a ticket is assigned to a human agent, AI will not reply to that ticket.
      </Alert>
    </Box>
  );
}
