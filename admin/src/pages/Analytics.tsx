import { useEffect, useState } from "react";
import { Alert, Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { adminRequest } from "../providers/dataProvider";

type AnalyticsData = {
  totals: Record<string, number>;
  revenue: { currency: string; total: number }[];
  orderStatuses: { status: string; total: number }[];
  paymentStatuses: { status: string; total: number }[];
  recentOrders: { month: string; orders: number; value: number }[];
};

function MetricCard({ label, value }: { label: string; value: number | undefined }) {
  return <Card variant="outlined" sx={{ height: "100%" }}><CardContent>
    <Typography color="text.secondary" variant="body2">{label}</Typography>
    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>{value ?? "—"}</Typography>
  </CardContent></Card>;
}

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    adminRequest("/admin/analytics").then(result => { if (active) setData(result.data); })
      .catch(() => { if (active) setError("Analytics could not be loaded. Refresh the page to try again."); });
    return () => { active = false; };
  }, []);
  const totals = data?.totals;
  const money = (value: number, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(value || 0);
  return <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200 }}>
    <Typography variant="h4" sx={{ mb: 1 }}>Analytics</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Live totals calculated from your NorDa database.</Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Grid container spacing={2}>
      {[
        ["Products", totals?.products], ["Customers", totals?.customers], ["Orders", totals?.orders],
        ["Paid orders", totals?.paidOrders], ["Inquiries", totals?.inquiries], ["All tickets", totals?.tickets],
        ["Open tickets", totals?.openTickets], ["Pending notifications", totals?.pendingNotifications],
        ["Notification failures", totals?.failedNotifications]
      ].map(([label, value]) => <Grid key={String(label)} size={{ xs: 12, sm: 6, md: 4 }}><MetricCard label={String(label)} value={value as number | undefined}/></Grid>)}
    </Grid>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Paid revenue</Typography>
        {data?.revenue.length ? data.revenue.map(item => <Stack key={item.currency} direction="row" justifyContent="space-between" sx={{ py: 1 }}><Typography>{item.currency}</Typography><Typography fontWeight={700}>{money(item.total, item.currency)}</Typography></Stack>) : <Typography color="text.secondary">No paid orders yet.</Typography>}
      </CardContent></Card></Grid>
      <Grid size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Order status</Typography>
        {data?.orderStatuses.length ? data.orderStatuses.map(item => <Stack key={item.status} direction="row" justifyContent="space-between" sx={{ py: 0.75 }}><Typography sx={{ textTransform: "capitalize" }}>{item.status.replaceAll("_", " ")}</Typography><Typography fontWeight={700}>{item.total}</Typography></Stack>) : <Typography color="text.secondary">No orders yet.</Typography>}
      </CardContent></Card></Grid>
      <Grid size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Payment status</Typography>
        {data?.paymentStatuses.length ? data.paymentStatuses.map(item => <Stack key={item.status} direction="row" justifyContent="space-between" sx={{ py: 0.75 }}><Typography sx={{ textTransform: "capitalize" }}>{item.status}</Typography><Typography fontWeight={700}>{item.total}</Typography></Stack>) : <Typography color="text.secondary">No payment records yet.</Typography>}
      </CardContent></Card></Grid>
      <Grid size={{ xs: 12, md: 6 }}><Card variant="outlined"><CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Recent orders · last 6 months</Typography>
        {data?.recentOrders.length ? data.recentOrders.map(item => <Stack key={item.month} direction="row" justifyContent="space-between" sx={{ py: 0.75 }}><Typography>{item.month}</Typography><Typography fontWeight={700}>{item.orders} orders</Typography></Stack>) : <Typography color="text.secondary">No recent orders.</Typography>}
      </CardContent></Card></Grid>
    </Grid>
  </Box>;
}
