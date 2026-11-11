import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useGetList } from "react-admin";

function Metric({ label, resource }: { label: string; resource: string }) {
  const { total, isLoading, error } = useGetList(resource, {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "created_at", order: "DESC" },
    filter: {},
  });

  return (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Typography color="text.secondary" variant="body2">{label}</Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
          {isLoading ? "…" : error ? "—" : total ?? 0}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" sx={{ mb: 1 }}>Overview</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        A live overview of your NorDa workspace.
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Metric label="Products" resource="products" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Metric label="Customers" resource="customers" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Metric label="Orders" resource="orders" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Metric label="Customer inquiries" resource="inquiries" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Metric label="Support tickets" resource="tickets" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Metric label="Admin activities" resource="activity" />
        </Grid>
      </Grid>
    </div>
  );
}
