import {
  Box,
  Typography,
  Chip,
  Divider,
  AccordionDetails,
  AccordionSummary,
  Accordion,
} from "@mui/material";
import { Button, CircularProgress } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { recompareResume } from "../../../services/resumeService";

interface ResumeData {
  id?: string;
  static?: {
    score?: number;
    keywords?: { matched?: string[]; missing?: string[] };
    sections?: { skills?: boolean; education?: boolean; experience?: boolean };
    suggestions?: string[];
    feedback?: string[];
  };
  aiResult?: any;
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
  const [loading, setLoading] = useState(false);

  // Safe fallback
  const score = data?.static?.score ?? 0;

  // Calculate issues dynamically
  const missingKeywords = data?.static?.keywords?.missing?.length || 0;
  const missingSections = Object.values(
    data?.static?.sections || {
      skills: false,
      education: false,
      experience: false,
    },
  ).filter((v) => !v).length;
  const suggestionIssues = data?.static?.suggestions?.length || 0;

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
          status: data?.static?.sections?.skills ? "Good" : "Missing",
        },
        {
          name: "Education",
          status: data?.static?.sections?.education ? "Good" : "Missing",
        },
        {
          name: "Experience",
          status: data?.static?.sections?.experience ? "Good" : "Missing",
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
            (data?.static?.keywords?.matched?.length || 0) > 5
              ? "Good"
              : "Improve",
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
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={async () => {
              const id = data?.id;
              if (!id) return;
              setLoading(true);
              try {
                const res = await recompareResume(id);
                // store the returned structured data
                localStorage.setItem("resumeAnalysis", JSON.stringify(res));
                window.location.reload();
              } catch (err) {
                console.error(err);
                setLoading(false);
              }
            }}
            disabled={!data?.id || loading}
          >
            {loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Re-compare"
            )}
          </Button>
        </Box>
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
