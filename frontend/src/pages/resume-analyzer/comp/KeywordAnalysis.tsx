import { Card, CardContent, Typography, Box, Chip, Stack } from "@mui/material";
import { Done, Block } from "@mui/icons-material";

interface Keywords {
  matched: string[];
  missing: string[];
}

const KeywordAnalysis = ({ keywords }: { keywords?: Keywords }) => {
  if (!keywords) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          🎯 Keyword Analysis
        </Typography>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: "success.main", mb: 1 }}
            >
              ✅ Matched Keywords ({keywords.matched?.length || 0})
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {keywords.matched?.map((k) => (
                <Chip
                  key={k}
                  icon={<Done />}
                  label={k}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: "error.main", mb: 1 }}>
              ❌ Missing Keywords ({keywords.missing?.length || 0})
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {keywords.missing?.map((k) => (
                <Chip
                  key={k}
                  icon={<Block />}
                  label={k}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
export default KeywordAnalysis;
