// static/main.js
document.addEventListener("DOMContentLoaded", () => {
    const { createApp, reactive, computed } = Vue;
  
    createApp({
      data() {
        return {
          questions: window.__QUESTIONS__ || [],
          answers: [],          // will become [ "", "", ... ] or [ [], [], ... ]
          currentIndex: 0
        };
      },
      computed: {
        isLast() {
          return this.currentIndex === this.questions.length - 1;
        },
        progress() {
          return Math.round(
            ((this.currentIndex) / (this.questions.length - 1 || 1)) * 100
          );
        }
      },
      methods: {
        hasAnswered(i) {
          const a = this.answers[i];
          return Array.isArray(a) ? a.length > 0 : !!a;
        },
        next() {
          if (!this.hasAnswered(this.currentIndex)) return;
          this.currentIndex++;
        },
        prev() {
          if (this.currentIndex > 0) this.currentIndex--;
        },
        async submitForm() {
          // build payload mapping question text → answer(s)
          const payload = {};
          this.questions.forEach((q, i) => {
            payload[q.text] = this.answers[i];
          });
  
          const res = await fetch("/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const { redirect } = await res.json();
          window.location = redirect;
        }
      },
      mounted() {
        // initialize answers with the correct shape
        this.questions.forEach((q, i) => {
          this.answers[i] = q.multi ? [] : "";
        });
      }
    }).mount("#questionnaire");
  });
  