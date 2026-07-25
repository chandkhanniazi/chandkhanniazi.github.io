/* CHAND KHAN NIAZI — FAQ bot (no backend, answers from site data) */
(function () {
  var WA = "https://wa.me/923367237957";
  var QA = [
    { q: "What are the fees?",
      a: "Three plans, all for 3 months of 1:1 coaching on WhatsApp:<br>• <b>Student — 10K PKR</b> (installments: 3,500 × 3)<br>• <b>Standard — 30K PKR</b> (weekly reviews)<br>• <b>Premium — 60K PKR</b> (daily reviews)<br><a href='enroll.html'>See full plan details →</a>" },
    { q: "How do I enroll?",
      a: "Four steps: 1) Message on WhatsApp and choose your plan. 2) Pay via JazzCash. 3) Send the payment screenshot on WhatsApp. 4) Fill the enrollment form you receive — and coaching begins.<br><a href='enroll.html'>Open the Enroll page →</a>" },
    { q: "Can I train at home?",
      a: "Yes. Coaching is both gym-based and home-based — your workout plan is built around the equipment you actually have." },
    { q: "Is it 100% natural?",
      a: "Yes — completely natural. Steroids are never part of this coaching. Supplements may be suggested where useful, but supplements support nutrition — they are not medicines." },
    { q: "Which programs exist?",
      a: "Fitness coaching (gym or home), weight gain / weight loss, skin &amp; beauty healing, and health recovery programs — for both men and women.<br><a href='programs-male.html'>Male programs →</a><br><a href='programs-female.html'>Female programs →</a>" },
    { q: "Do you coach females?",
      a: "Yes — there is a full set of female programs, including Body Sculpting Coaching and the Flat to Fit Body Program.<br><a href='programs-female.html'>See female programs →</a>" },
    { q: "Can teenagers enroll?",
      a: "Yes. The Student plan is designed for students and beginners, and the installment option makes starting easier. There is also a Height Growth Program for teenagers." },
    { q: "What is the consultation?",
      a: "A 30-minute, appointment-based consultation for <b>2,000 PKR</b>. If you enroll afterwards, the fee is adjusted into your coaching plan. All personal case questions are answered here.<br><a href='" + WA + "?text=Assalam%20o%20Alaikum%2C%20I%20want%20to%20book%20a%20consultation.' target='_blank' rel='noopener'>Book on WhatsApp →</a>" },
    { q: "Payment method?",
      a: "JazzCash: <b>0308-2623522</b> — Account title: Muhammad Chand Ul Hameed Khan. After paying, send the screenshot on WhatsApp to confirm your enrollment." }
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  var btn = el("button", "fb-btn");
  btn.setAttribute("aria-label", "Quick answers");
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.9 3 3 6.5 3 10.8c0 2.4 1.2 4.5 3.1 5.9-.1 1-.5 2.2-1.5 3.3 1.8-.2 3.2-.8 4.2-1.5.9.3 2 .4 3.2.4 5.1 0 9-3.5 9-7.9S17.1 3 12 3zm-4 9.2c-.7 0-1.3-.6-1.3-1.3S7.3 9.6 8 9.6s1.3.6 1.3 1.3-.6 1.3-1.3 1.3zm4 0c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3zm4 0c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z"/></svg><span>Questions?</span>';

  var panel = el("div", "fb-panel");
  var head = el("div", "fb-head", "<b>☾ Quick Answers</b>");
  var close = el("button", "fb-close", "×");
  close.setAttribute("aria-label", "Close");
  head.appendChild(close);
  var body = el("div", "fb-body");
  var note = el("div", "fb-note", "Personal case questions are answered in consultation only.");
  panel.appendChild(head); panel.appendChild(body); panel.appendChild(note);

  var chips = el("div", "fb-chips");
  QA.forEach(function (item) {
    var c = el("button", "fb-chip", item.q);
    c.addEventListener("click", function () {
      body.insertBefore(el("div", "fb-msg user", item.q), chips);
      body.insertBefore(el("div", "fb-msg bot", item.a), chips);
      body.scrollTop = body.scrollHeight;
    });
    chips.appendChild(c);
  });

  body.appendChild(el("div", "fb-msg bot", "Assalam o Alaikum — tap a question below for an instant answer."));
  body.appendChild(chips);

  btn.addEventListener("click", function () { panel.classList.toggle("open"); });
  close.addEventListener("click", function () { panel.classList.remove("open"); });

  document.body.appendChild(panel);
  document.body.appendChild(btn);
})();
