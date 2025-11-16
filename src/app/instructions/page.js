"use client";
import Navbar from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import "./instruction.css";
import Button from "@/components/button/Button";

export default function Instructions() {
  const router = useRouter();

  const handleStartTest = () => {
    router.push("/mcq");
  };
  return (
    <div className="instructions">
      <Navbar />
      <div className="instruction-section">
        <div className="instruction">
          {/* instruction data */}
          <div className="instruction-header">
            <h1>Ancient Indian History MCQ</h1>
          </div>

          <div className="test-info">
            <div className="info-box">
              <div className="info-label">Total MCQs:</div>
              <div className="info-value">100</div>
            </div>
            <div className="info-box">
              <div className="info-label">Total marks:</div>
              <div className="info-value">100</div>
            </div>
            <div className="info-box">
              <div className="info-label">Total time:</div>
              <div className="info-value">90:00</div>
            </div>
          </div>

          <div className="instructions-list">
            <h3>Instructions:</h3>
            <ol>
              <li>1. You have 100 minutes to complete the test.</li>
              <li>2. Test consists of 100 multiple-choice qs.</li>
              <li>
                3. You are allowed 2 retake attempts if you do not pass on the
                first try.
              </li>
              <li>
                4. Each incorrect answer will incur a negative mark of -1/4.
              </li>
              <li>
                5. Ensure you are in a quiet environment and have a stable
                internet connection.
              </li>
              <li>
                6. Keep an eye on the timer, and try to answer all questions
                within the given time.
              </li>
              <li>
                7. Do not use any external resources such as dictionaries,
                websites, or assistance.
              </li>
              <li>
                8. Complete the test honestly to accurately assess your
                proficiency level.
              </li>
              <li>9. Check answers before submitting.</li>
              <li>
                10. Your test results will be displayed immediately after
                submission, indicating whether you have passed or need to retake
                the test.
              </li>
            </ol>
          </div>

          <Button
            text={"Start Test"}
            className="start-test-btn"
            onClick={handleStartTest}
          />
        </div>
      </div>
    </div>
  );
}
