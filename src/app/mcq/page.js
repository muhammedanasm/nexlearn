"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar/Navbar";
import { IoMdArrowDropright } from "react-icons/io";
import Swal from "sweetalert2";
import "./mcq.css";
import useApi from "@/hooks/useApi";

export default function MCQPage() {
  const [currentIndex, setCurrentIndex] = useState(0); // question index (0-99)
  const [answers, setAnswers] = useState({}); // { question_id: option_id }
  const [status, setStatus] = useState({}); // question status
  const [timer, setTimer] = useState(0);
  const [showComprehension, setShowComprehension] = useState(false);

  // Generate question numbers 1-100
  const questionNumbers = Array.from({ length: 100 }, (_, i) => i + 1);

  const getQuestionStatus = (num) => {
    if (num === 1) return "answered";
    if (num === 2) return "not-answered";
    if (num === 3) return "answered";
    if (num === 4) return "not-answered";
    if (num === 5) return "answered";
    if (num === 6) return "marked";
    if (num === 7) return "answered-marked";
    return "not-visited";
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  // Question List API

  console.log("tokenss", token);

  const {
    loading: questionLoading,
    response: questionData,
    refetch: getQuestions,
  } = useApi("GET", "/question/list", null, null);

  // 1) Call API once when page loads AND token exists
  useEffect(() => {
    if (token) {
      getQuestions();
    }
    // We intentionally don't add getQuestions to deps to avoid repeated calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // 2) Log response only when it changes (stops continuous logging)
  useEffect(() => {
    if (questionData) {
      console.log("questionData", questionData);
    }
  }, [questionData]);

  // 2) When API returns questions
  // -----------------------------
  useEffect(() => {
    if (questionData?.success) {
      const q = questionData.questions;

      // set default status
      let initialStatus = {};
      q.forEach((item) => {
        initialStatus[item.id] = "not-visited";
      });

      setStatus(initialStatus);

      // Start timer (in minutes → seconds)
      setTimer(questionData.total_time * 60);
    }
  }, [questionData]);

  const questions = questionData?.questions || [];
  const currentQuestion = questions[currentIndex];

  // -----------------------------
  // 3) Timer countdown
  // -----------------------------
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // -----------------------------
  // 4) User selects an answer
  // -----------------------------
  const handleSelectAnswer = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });

    setStatus({
      ...status,
      [questionId]: "answered",
    });
  };

  // -----------------------------
  // 5) Mark for review
  // -----------------------------
  const handleMarkReview = (questionId) => {
    setStatus({
      ...status,
      [questionId]: "marked",
    });
  };

  // -----------------------------
  // 6) Navigate question
  // -----------------------------
  const goToQuestion = (index) => {
    const qId = questions[index]?.id;

    // update visited
    if (status[qId] === "not-visited") {
      setStatus({
        ...status,
        [qId]: "not-answered",
      });
    }

    setCurrentIndex(index);
    setTimer(questionData.total_time * 60);
  };

  // -----------------------------
  // 7) Submit Answers API
  // -----------------------------
  const {
    loading: submitLoading,
    response: submitResponse,
    refetch: submitExam,
  } = useApi("POST", "/answers/submit");

  const handleSubmit = () => {
    const payload = {
      answers: JSON.stringify(
        questions.map((q) => ({
          question_id: q.id,
          selected_option_id: answers[q.id] || null,
        }))
      ),
    };

    submitExam(payload);
  };

  // Format timer
  const formatTime = () => {
    const m = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const s = (timer % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Current question
  const currentQ = questions[currentIndex];

  const openComprehensionModal = () => {
    if (!currentQuestion?.comprehension) {
      Swal.fire("No Data", "Comprehension paragraph not found.", "warning");
      return;
    }

    Swal.fire({
      title: "Comprehensive Paragraph",
      html: `
      <div style="
        max-height: 350px;
        overflow-y: auto;
        text-align: left;
        padding: 10px;
        font-size: 16px;
        line-height: 1.6;
      ">
        ${currentQuestion?.comprehension}
      </div>
    `,
      width: "800px",
      confirmButtonText: "Minimize",
      customClass: {
        popup: "swal-wide",
      },
    });
  };

  const openSubmitModal = () => {
    const totalQuestions = questions.length;
    const answeredCount = Object.values(status).filter(
      (s) => s === "answered" || s === "answered-marked"
    ).length;

    const markedCount = Object.values(status).filter(
      (s) => s === "marked" || s === "answered-marked"
    ).length;

    Swal.fire({
      title: "Are you sure you want to submit the test?",
      html: `
      <div style="text-align:left; line-height:1.8; font-size:16px">
        <p><b>⏱ Remaining Time:</b> ${formatTime()}</p>
        <p><b>📘 Total Questions:</b> ${totalQuestions}</p>
        <p><b>🟢 Questions Answered:</b> ${answeredCount}</p>
        <p><b>🟣 Marked for Review:</b> ${markedCount}</p>
      </div>
    `,
      width: "420px",
      confirmButtonText: "Submit Test",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((res) => {
      if (res.isConfirmed) {
        handleSubmit();
        window.location.href = "/result";
      }
    });
  };

  return (
    <div className="mcq_screen">
      <Navbar />
      <div className="mcq_parent">
        {/* Left Section - Question */}
        <div className="mcq_history">
          <div className="mcq_header">
            <div className="mcq_title">
              <h2>Ancient Indian History MCQ</h2>
            </div>
            <div className="mcq_info">
              <span>
                {currentIndex + 1}/{questions.length}
              </span>
            </div>
          </div>

          <div className="question_section">
            <div className="questions_l1">
              <div className="read_comprehension">
                <button className="comp_btn" onClick={openComprehensionModal}>
                  <img src="./images/read.svg" /> Read Comprehensive Paragraph
                  <IoMdArrowDropright />
                </button>
              </div>

              <p className="question_text">{currentQuestion?.question}</p>

              <div className="question_image">
                <img
                  src={currentQuestion?.image || "./images/noimage.webp"}
                  alt="question"
                />
              </div>
            </div>

            <p className="choose_answer">Choose the answer:</p>

            {/* OPTIONS */}
            <div className="options">
              {currentQuestion?.options?.map((op) => (
                <label className="option" key={op.id}>
                  <input
                    type="radio"
                    name={`q_${currentQuestion.question_id}`}
                    checked={answers[currentQuestion.question_id] === op.id}
                    onChange={() =>
                      handleSelectAnswer(currentQuestion.question_id, op.id)
                    }
                  />
                  <span>{op.option}</span>
                </label>
              ))}
            </div>

            <div className="navigation_buttons">
              <button
                className="mark_review_btn"
                onClick={() => handleMarkReview(currentQuestion.question_id)}
              >
                Mark for Review
              </button>

              <button
                className="previous_btn"
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
              >
                Previous
              </button>

              <button
                className="next_btn"
                disabled={currentIndex === questions.length - 1}
                onClick={() => goToQuestion(currentIndex + 1)}
              >
                Next
              </button>
              <button className="submit_test_btn" onClick={openSubmitModal}>
                Submit Test
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Question Sheet */}

        <div className="question_sheet_right">
          <div className="flex items-center justify-between mb-2">
            <span>Question No. Sheet</span>
            <p className="flex items-center gap-1">
              Remaining Time
              <span className="remaining_time">⏱ {formatTime()}</span>
            </p>
          </div>
          <div className="question_sheet">
            <div className="question_grid">
              {questions.map((q, index) => (
                <button
                  key={q.question_id}
                  className={`question_number 
    ${status[q.question_id]} 
    ${currentIndex === index ? "active_question" : ""}
  `}
                  onClick={() => goToQuestion(index)}
                >
                  {q.number}
                </button>
              ))}
            </div>

            <div className="legend">
              <div className="legend_item">
                <span className="legend_box answered"></span>
                <span>Answered</span>
              </div>
              <div className="legend_item">
                <span className="legend_box not-answered"></span>
                <span>Not Answered</span>
              </div>
              <div className="legend_item">
                <span className="legend_box marked"></span>
                <span>Marked for Review</span>
              </div>
              <div className="legend_item">
                <span className="legend_box answered-marked"></span>
                <span>Answered and Marked for Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
