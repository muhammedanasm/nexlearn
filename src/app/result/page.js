import Navbar from "@/components/navbar/Navbar";
import "./result.css";

export default function ResultPage() {
  const resultData = {
    totalMarks: 100,
    marksObtained: 100,
    totalQuestions: 100,
    correctAnswers: 3,
    incorrectAnswers: 1,
    notAttempted: 96,
  };

  return (
    <div className="result_page_wrapper">
      <Navbar />
      <div className="result_page">
        <div className="result_container">
          <div className="result_header">
            <div className="marks_display">
              <h2>Marks Obtained:</h2>
              {resultData.marksObtained} / {resultData.totalMarks}
            </div>
          </div>

          <div className="result_stats">
            <div className="stat_item total">
              <span className="stat_icon">
                <img src="./images/orange.svg" />
              </span>
              <span className="stat_label">Total Questions:</span>
              <span className="stat_value">{resultData.totalQuestions}</span>
            </div>

            <div className="stat_item correct">
              <span className="stat_icon">
                <img src="./images/green.svg" />
              </span>
              <span className="stat_label">Correct Answers:</span>
              <span className="stat_value">{resultData.correctAnswers}</span>
            </div>

            <div className="stat_item incorrect">
              <span className="stat_icon">
                <img src="./images/red.svg" />
              </span>
              <span className="stat_label">Incorrect Answers:</span>
              <span className="stat_value">{resultData.incorrectAnswers}</span>
            </div>

            <div className="stat_item not-attempted">
              <span className="stat_icon">
                <img src="./images/not.svg" />
              </span>
              <span className="stat_label">Not Attempted Questions:</span>
              <span className="stat_value">{resultData.notAttempted}</span>
            </div>
          </div>

          <button className="done_btn">Done</button>
        </div>
      </div>
    </div>
  );
}
