import { Box, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import ScoreSidebar from "./comp/ScoreSidebar";
import ContentAnalysis from "./comp/ContentAnalysis";
import PageTitle from "../../components/custom/PageTitle";
import KeywordAnalysis from "./comp/KeywordAnalysis";
import SuggestionsPanel from "./comp/SuggestionsPanel";
import AiFeedback from "./comp/AiFeedback";

const ResultPage = () => {
  const location = useLocation();

  const data =
    location.state ||
    JSON.parse(localStorage.getItem("resumeAnalysis") || "{}");

  return (
    <>
      <PageTitle title="Resume Analysis Result" />

      <Box sx={{ background: "#f5f7fb", minHeight: "100vh", p: 2 }}>
        <Grid container spacing={3}>
          {/* LEFT SIDEBAR */}
          <Grid size={3.4} sx={{ minHeight: "88vh" }}>
            <ScoreSidebar data={data} />
          </Grid>

          {/* RIGHT CONTENT */}
          <Grid size={8.6} sx={{ overflow: "auto", maxHeight: "88vh" }}>
            {/* SECTION ANALYSIS */}
            <ContentAnalysis sections={data.sections} />

            {/* KEYWORD MATCH */}
            <KeywordAnalysis keywords={data.keywords} />

            {/* AI SUGGESTIONS */}
            <SuggestionsPanel suggestions={data.suggestions} />

            {/* AI FEEDBACK (Rewrite + Summary) */}
            <AiFeedback feedback={data.feedback} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ResultPage;
