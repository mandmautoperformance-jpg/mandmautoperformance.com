const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, WidthType, BorderStyle, ShadingType, HeadingLevel, 
        PageBreak, LevelFormat, ListLevel } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 32, bold: true, font: "Arial", color: "2C2F33" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 28, bold: true, font: "Arial", color: "00CED1" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("M&M AUTO PERFORMANCE")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Complete Build & Deployment Guide")] }),
      new Paragraph({ text: "" }),
      new Paragraph({ children: [new TextRun("2026 Q2 Launch | 9 Weeks | Total Cost: £36,255")] }),
      new PageBreak(),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Executive Summary")] }),
      new Paragraph({ children: [new TextRun("This guide provides step-by-step instructions for building M&M Auto Performance across three phases:")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Phase 1 (Weeks 1-3): MVP Launch - Core booking, AI Concierge, GPS tracking")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Phase 2 (Weeks 4-6): Business Automation - Annual Returns, Social Media, Telematics")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Phase 3 (Weeks 7-9): Local SEO Dominance - Landing pages, schema markup, ASO")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("PHASE 1: MVP Launch (Weeks 1-3)")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 1: Setup & Database")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Create Vercel project linked to GitHub")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Configure environment variables")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Setup Supabase project (free tier)")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Run database migrations")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Configure Row Level Security policies")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 2: Core Components")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Get Gemini 1.5 Flash API key from Google AI Studio")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Wire Sky Concierge component to Gemini endpoint")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Implement rate limiting (100 req/min)")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Connect BookingWidget to /api/bookings")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Setup document upload + Google Vision OCR")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Integrate Supabase Realtime for GPS tracking")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Add Google Maps API for vehicle locations")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 3: Testing & Launch")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Run Jest unit tests (100% passing)")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Run Playwright E2E tests")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Test booking flow with 10+ test accounts")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Push to main | Vercel auto-deploys")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Enable Google My Business for St Albans + Watford")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Post launch announcement on X & Instagram")] }),
      new Paragraph({ text: "" }),

      new PageBreak(),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("PHASE 2: Business Automation (Weeks 4-6)")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 4-5: Annual Returns & Social Media")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Build AnnualReturns component (HMRC-compliant CSV/PDF)")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Add &#x201C;Annual Returns&#x201D; tab to admin dashboard")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Build SocialMediaScheduler component")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Create Gemini prompt templates for X, Instagram, LinkedIn")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Setup X API + Instagram Graph API")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Deploy cron jobs for scheduled posting")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 6: Fleet Telematics & Habit Score")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Build Habit Score algorithm (0-100 per trip)")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Track metrics: acceleration, braking, speed, cornering")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Implement loyalty points + tier badges")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Build maintenance alert system")] }),
      new Paragraph({ text: "" }),

      new PageBreak(),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("PHASE 3: Local SEO Dominance (Weeks 7-9)")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 7: Dynamic Landing Pages")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Create landing page template: /hire-supercar-[city]")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Launch pages for: St Albans, Watford, Harpenden, Hemel Hempstead")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Add Mayfair delivery + London West End variants")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 8: Schema & Technical SEO")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Implement JSON-LD: CarRental + LocalBusiness + AggregateRating")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Setup & verify Google My Business locations")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Post offers & events, collect reviews")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Week 9: ASO & Amplification")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Optimize App Store screenshots (Turquoise UI)")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Partner with Herts micro-influencers")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Publish user testimonials + car photos")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, children: [new TextRun("Target 5K+ weekly impressions")] }),
      new Paragraph({ text: "" }),

      new PageBreak(),
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Launch Checklist")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("48 Hours Before")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Backup production database")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Run full test suite - 100% passing")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Load test: 100 concurrent users")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Verify all API rate limits")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Launch Day")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Final code push to main")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Monitor Vercel deployment")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Test booking end-to-end")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Post 3 launch tweets (12pm, 3pm, 6pm)")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Send press release to local Herts media")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Post-Launch")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Monitor uptime 24/7 for 7 days")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Check Sentry for errors")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Respond to user feedback")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun("Publish customer testimonials")] }),
      new Paragraph({ text: "" }),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Next Steps")] }),
      new Paragraph({ children: [new TextRun("For complete code & components, reference: AGENTS.md, COMPONENT_LIBRARY.md, API.md in the project root.")] }),
      new Paragraph({ children: [new TextRun("Tech Lead: [contact]  |  DevOps: [contact]  |  24/7 On-call Rotation: First 2 weeks")] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("M&M_Build_Guide.docx", buffer);
  console.log("✅ Build Guide created!");
});
