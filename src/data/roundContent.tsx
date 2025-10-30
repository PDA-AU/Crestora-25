import React from 'react';

// Round content data for modal display
export interface RoundContent {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  formUrl?: string;
  contact?: {
    name: string;
    phone: string;
  }[];
  additionalInfo?: string;
}

// Round 1 content
export const round1Content: RoundContent = {
  title: "Team Identity — The Creative Prelude",
  subtitle: "Round 1 Details",
  formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSdF2RndaINy13_wv_b0ulYwg2iCCJ-k7nj3zwjtU55v7DgfrA/viewform?usp=header",
  contact: [
    { name: "Ms. Akshaya Gothandabani", phone: "+91 88387 42309" },
    { name: "Ms. Dhivya", phone: "9080682474" }
  ],
  content: (
    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
      {/* 🌟✨ PDA MIT Presents — CRESTORA'25 (ODD SEM SIGNATURE EVENT) ✨🌟 */}
      <div className="text-lg font-semibold">🌟✨ PDA MIT Presents — CRESTORA'25 (ODD SEM SIGNATURE EVENT) ✨🌟</div>

      {/* 🎯 Round 1: "Team Identity — The Creative Prelude" */}
      <div>
        <strong>🎯 Round 1:</strong> "Team Identity — The Creative Prelude"
      </div>

      {/* 📅 Event Duration */}
      <div className="space-y-1">
        <strong>📅 Event Duration:</strong>
        <div>🕚 Starts: 18th Oct, 11:00 AM</div>
        <div>🕚 Ends: 19th Oct, 11:00 AM</div>
        <div>⏰ Total Duration: 24 hours</div>
      </div>

      {/* 💻 Mode: ONLINE ROUND 🌐 */}
      <div><strong>💻 Mode:</strong> ONLINE ROUND 🌐</div>

      {/* 🎬 ROUND DETAILS */}
      <div>
        <strong>🎬 ROUND DETAILS:</strong>
        <div>
          This round is all about introducing your team — let the world know who you are in the most creative, spontaneous, and original way possible!
        </div>
        <div className="mt-2">
          Your team introduction can be in any form —
          <ul className="list-disc ml-6 mt-1">
            <li>A website</li>
            <li>A video</li>
            <li>An article</li>
            <li>A meme</li>
            <li>Anything unique that speaks for your team's name, spirit, and originality!</li>
          </ul>
        </div>
      </div>

      {/* 📩 Submission */}
      <div>
        <strong>📩 Submission:</strong>
        <div>You will be given a Google Form to submit your works. Submit your work as a link in the form.</div>
      </div>

      {/* ⚠️ GUIDELINES (STRICTLY TO BE FOLLOWED) */}
      <div>
        <strong>⚠️ GUIDELINES (STRICTLY TO BE FOLLOWED):</strong>
        <ul className="list-disc ml-6 mt-1">
          <li>🚫 No Plagiarism — originality is key.</li>
          <li>🤖 Excessive dependency on AI tools = score reduction.</li>
          <li>❌ Vulgarity or personal offense = direct disqualification.</li>
          <li>🧠 No lame excuses! This round tests your critical thinking, spontaneity & creativity.</li>
        </ul>
      </div>

      {/* 🏆 EVALUATION CRITERIA */}
      <div>
        <strong>🏆 EVALUATION CRITERIA:</strong>
        <div className="ml-6">
          <div>✨ Professionalism</div>
          <div>✨ Clarity</div>
          <div>✨ Team Spirit</div>
          <div>✨ Individuality</div>
          <div>✨ Content Creation</div>
        </div>
      </div>

      {/* 💥 BONUS */}
      <div>
        <strong>💥 BONUS:</strong> Add a creative record of your team's strengths to earn extra points!
      </div>

      {/* 🔥 Showcase your identity. Unleash your creativity. Leave your mark. */}
      <div className="pt-2">
        <strong>🔥 Showcase your identity. Unleash your creativity. Leave your mark.</strong>
        <div>💫 Let CRESTORA'25 witness your team's spark!</div>
        <div className="mt-2 font-semibold">📣 All the best, warriors of PDA! 💪</div>
      </div>
    </div>
  )
};

// Placeholder content for other rounds
export const defaultRoundContent: RoundContent = {
  title: "Round Details",
  subtitle: "Coming Soon",
  content: (
    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
      {/* 📋 Round Information */}
      <div className="text-lg font-semibold">📋 Round Information</div>
      {/* 📅 Event Details */}
      <div>
        <strong>📅 Event Details:</strong>
        <div>More information will be available soon.</div>
      </div>
      {/* 💻 Mode: TBA */}
      <div>
        <strong>💻 Mode:</strong> TBA
      </div>
      {/* 🎯 ROUND DETAILS */}
      <div>
        <strong>🎯 ROUND DETAILS:</strong>
        <div>Detailed information about this round will be updated shortly.</div>
      </div>
    </div>
  )
};

// Round content mapping
export const roundContentMap: Record<number, RoundContent> = {
  1: round1Content,
 
  // Add more rounds as needed
};

// Helper function to get round content
export const getRoundContent = (roundNumber: number): RoundContent => {
  return roundContentMap[roundNumber] || defaultRoundContent;
};
