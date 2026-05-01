import { Container } from "@mui/material";
import PageTitle from "../../components/custom/PageTitle";
import ResumeInput from "./comp/ResumeInput";
import { useNavigate } from "react-router-dom";

const ResumeAnalyzerPage = () => {
  const navigate = useNavigate();

  const handleAnalysisComplete = (data: any) => {
    localStorage.setItem("resumeAnalysis", JSON.stringify(data));
    navigate("/ai-resume-analyzer/result");
  };

  return (
    <>
      <PageTitle title="AI Resume Analyzer" />

      <Container
        maxWidth="md"
        sx={{
          mt: 6,
        }}
      >
        <ResumeInput onAnalysisComplete={handleAnalysisComplete} />
      </Container>
    </>
  );
};

export default ResumeAnalyzerPage;
