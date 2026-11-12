import { useEffect, useState } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import { adminRequest } from "../providers/dataProvider";

export function AIAssistantPage() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>AI Assistant</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Control NorDa's automatic customer-support replies.
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
            <Box>
              <Typography variant="h6">Automatic replies</Typography>
              <Typography color="text.secondary" variant="body2">
                {enabled ? "AI can reply to new visitor messages when a ticket is in AI mode." : "AI automatic replies are disabled globally. Visitors can still request a human agent."}
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
        Human handoff is independent of this switch. Once a ticket is assigned to a human agent, AI will not reply to that ticket.
      </Alert>
    </Box>
  );
}
