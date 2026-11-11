import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Datagrid,
  DateField,
  List,
  Show,
  SimpleShowLayout,
  TextField,
  TextInput,
  useNotify,
  useRecordContext,
  useRefresh
} from "react-admin";
import { adminRequest } from "../providers/dataProvider";

type TicketRecord = {
  id: string;
  public_id: string;
  status: string;
  user_name?: string;
};

type TicketMessage = {
  id: number;
  sender_type: string;
  message_text: string;
  created_at: string;
};

function TicketConversation() {
  const record = useRecordContext<TicketRecord>();
  const notify = useNotify();
  const refresh = useRefresh();
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!record?.id) return;
    let active = true;
    let firstLoad = true;
    const loadMessages = () => {
      adminRequest("/admin/tickets/" + encodeURIComponent(record.id) + "/messages")
        .then(result => {
          if (active) setMessages(Array.isArray(result.data) ? result.data : []);
        })
        .catch(error => {
          if (active && firstLoad) notify(error instanceof Error ? error.message : "Could not load ticket messages", { type: "error" });
        })
        .finally(() => { firstLoad = false; });
    };
    loadMessages();
    const timer = window.setInterval(loadMessages, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [record?.id, refreshKey, notify]);

  if (!record) return null;

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || loading) return;
    setLoading(true);
    try {
      const result = await adminRequest("/admin/tickets/" + encodeURIComponent(record.id) + "/reply", {
        method: "POST",
        body: JSON.stringify({ message })
      });
      setMessages(Array.isArray(result.data) ? result.data : messages);
      setDraft("");
      notify("Reply sent. AI support is now disabled for this ticket.", { type: "success" });
      setRefreshKey(value => value + 1);
      refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not send reply", { type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function closeTicket() {
    if (loading || record.status !== "open") return;
    setLoading(true);
    try {
      await adminRequest("/admin/tickets/" + encodeURIComponent(record.id) + "/close", { method: "POST", body: "{}" });
      notify("Ticket closed", { type: "success" });
      refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not close ticket", { type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ width: "100%", marginTop: 20 }}>
      <h3>Conversation</h3>
      <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
        {messages.map(message => (
          <article key={message.id} style={{ border: "1px solid #dedede", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
              <strong>{message.sender_type === "visitor" ? "Visitor" : message.sender_type === "admin" ? "Support / AI" : message.sender_type}</strong>
              <small>{new Date(message.created_at).toLocaleString()}</small>
            </div>
            <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", margin: 0 }}>{message.message_text}</p>
          </article>
        ))}
        {messages.length === 0 && <p>No messages found for this ticket.</p>}
      </div>
      {record.status === "open" ? (
        <>
          <form onSubmit={sendReply} style={{ display: "grid", gap: 10 }}>
            <label htmlFor="ticket-reply"><strong>Reply to visitor</strong></label>
            <textarea
              id="ticket-reply"
              value={draft}
              onChange={event => setDraft(event.target.value)}
              rows={5}
              maxLength={4000}
              placeholder="Write a support reply..."
              disabled={loading}
              style={{ width: "100%", boxSizing: "border-box", padding: 12, border: "1px solid #aaa", borderRadius: 6, font: "inherit", resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="submit" disabled={loading || !draft.trim()} style={{ padding: "10px 18px", cursor: loading || !draft.trim() ? "not-allowed" : "pointer" }}>
                {loading ? "Please wait..." : "Send reply"}
              </button>
              <button type="button" disabled={loading} onClick={closeTicket} style={{ padding: "10px 18px" }}>
                Close ticket
              </button>
            </div>
          </form>
          <p style={{ color: "#666", fontSize: 13 }}>Sending a human reply switches this ticket to human support and prevents further AI replies. Telegram replies remain visible here because both channels use the same message records.</p>
        </>
      ) : <p>This ticket is closed. Replies are disabled.</p>}
    </section>
  );
}

export function TicketList() {
  return (
    <List
      filters={[<TextInput source="q" label="Search tickets" alwaysOn key="q" />]}
      perPage={25}
      sort={{ field: "created_at", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="public_id" label="Ticket ID" />
        <TextField source="user_name" label="Visitor" />
        <TextField source="status" />
        <TextField source="support_mode" label="Support mode" />
        <TextField source="handoff_status" label="Handoff" />
        <DateField source="created_at" showTime />
        <DateField source="closed_at" showTime />
      </Datagrid>
    </List>
  );
}

export function TicketShow() {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="public_id" label="Ticket ID" />
        <TextField source="user_name" label="Visitor" />
        <TextField source="status" />
        <TextField source="support_mode" label="Support mode" />
        <TextField source="handoff_status" label="Handoff" />
        <DateField source="created_at" showTime />
        <DateField source="closed_at" showTime />
        <TicketConversation />
      </SimpleShowLayout>
    </Show>
  );
}
