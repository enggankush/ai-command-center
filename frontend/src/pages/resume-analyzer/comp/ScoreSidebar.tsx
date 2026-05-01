import {
  Box,
  Typography,
  Chip,
  Divider,
  AccordionDetails,
  AccordionSummary,
  Accordion,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

interface ResumeData {
  score: number;
  keywords?: {
    matched: string[];
    missing: string[];
  };
  sections?: {
    skills: boolean;
    education: boolean;
    experience: boolean;
  };
  suggestions?: string[];
}

interface Item {
  name: string;
  status: string;
}

interface Section {
  title: string;
  score: string;
  items: Item[];
}

const ScoreSidebar = ({ data }: { data: ResumeData }) => {
  const [expanded, setExpanded] = useState<number | false>(0);

  // Safe fallback
  const score = data?.score ?? 0;

  // Calculate issues dynamically
  const missingKeywords = data?.keywords?.missing?.length || 0;
  const missingSections = Object.values(data?.sections || {}).filter(
    (v) => !v,
  ).length;
  const suggestionIssues = data?.suggestions?.length || 0;

  const issues = missingKeywords + missingSections + suggestionIssues;

  // Dynamic Section Builder
  const groupedSections: Section[] = [
    {
      title: "ATS SCORE",
      score: `${score}%`,
      items: [
        {
          name: "Overall Score",
          status: score > 80 ? "Good" : score > 60 ? "Improve" : "Poor",
        },
      ],
    },

    {
      title: "SECTIONS",
      score: `${Math.max(100 - missingSections * 30, 0)}%`,
      items: [
        {
          name: "Skills",
          status: data?.sections?.skills ? "Good" : "Missing",
        },
        {
          name: "Education",
          status: data?.sections?.education ? "Good" : "Missing",
        },
        {
          name: "Experience",
          status: data?.sections?.experience ? "Good" : "Missing",
        },
      ],
    },

    {
      title: "KEYWORDS",
      score: `${Math.max(100 - missingKeywords * 10, 0)}%`,
      items: [
        {
          name: "Matched Keywords",
          status:
            (data?.keywords?.matched?.length || 0) > 5 ? "Good" : "Improve",
        },
        {
          name: "Missing Keywords",
          status: missingKeywords > 0 ? "Missing" : "Good",
        },
      ],
    },

    {
      title: "SUGGESTIONS",
      score: `${Math.max(100 - suggestionIssues * 10, 0)}%`,
      items: [
        {
          name: "Improvements Needed",
          status:
            suggestionIssues === 0
              ? "Good"
              : suggestionIssues < 3
                ? "Improve"
                : "Poor",
        },
      ],
    },
  ];

  // status color
  const getColor = (status: string) => {
    if (status === "Good") return "success";
    if (status === "Improve") return "warning";
    if (status === "Missing" || status === "Poor") return "error";
    return "default";
  };

  const handleChange =
    (panel: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 1,
        p: 2,
        boxShadow: 1,
        position: "sticky",
        top: 20,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      {/* SCORE */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Your Score
        </Typography>

        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            mt: 1,
            color: score > 80 ? "#2dc08d" : score > 60 ? "#f9a825" : "#d32f2f",
          }}
        >
          {score}/100
        </Typography>

        <Typography color="text.secondary">
          {issues} Issue{issues !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {groupedSections.map((section, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleChange(index)}
          sx={{
            boxShadow: "none",
            mb: 1,
            "&:before": { display: "none" },
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>{section.title}</Typography>
              <Typography color="success.main">{section.score}</Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            {section.items.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2">{item.name}</Typography>

                <Chip
                  label={item.status}
                  color={getColor(item.status) as any}
                  size="small"
                />
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ScoreSidebar;
