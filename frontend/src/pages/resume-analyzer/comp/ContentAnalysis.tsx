import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { Check, Close } from "@mui/icons-material";

interface Sections {
  skills: boolean;
  education: boolean;
  experience: boolean;
}

const ContentAnalysis = ({ sections }: { sections?: Sections }) => {
  if (!sections) return null;

  const sectionData = [
    { name: "Skills", status: sections.skills },
    { name: "Education", status: sections.education },
    { name: "Experience", status: sections.experience },
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          📋 Section Analysis
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {sectionData.map((item) => (
            <Chip
              key={item.name}
              icon={item.status ? <Check /> : <Close />}
              label={item.name}
              color={item.status ? "success" : "error"}
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
export default ContentAnalysis;
