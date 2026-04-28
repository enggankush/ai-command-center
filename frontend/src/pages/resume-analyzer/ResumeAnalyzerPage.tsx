import { Container } from "@mui/material";
import PageTitle from "../../components/custom/PageTitle";
import ResumeInput from "./comp/ResumeInput";
import { useNavigate } from "react-router-dom";

const ResumeAnalyzerPage = () => {
  const navigate = useNavigate();

  // ✅ Handle response properly
  const handleAnalysisComplete = (data: any) => {
    // assuming backend returns { analysisId: "123" }
    const analysisId = data?.analysisId;

    if (analysisId) {
      navigate(`/analysis/${analysisId}`);
    }
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
