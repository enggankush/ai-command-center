import { Card, CardContent, Typography, Box } from "@mui/material";

const AiFeedback = ({ feedback }: { feedback?: string[] }) => {
  if (!feedback || feedback.length === 0) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          🤖 AI Feedback
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {feedback.map((f, i) => (
            <Typography
              key={i}
              variant="body2"
              sx={{ p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}
            >
              • {f}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
export default AiFeedback;
