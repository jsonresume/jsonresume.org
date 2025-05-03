import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const format = async function format(resume) {
  const { text } = await generateText({
    model: openai('gpt-4.1'),
    prompt: `
    
    You create agents out of human souls.

Great — I’ll create a stylistic pitch deck concept for your agent-based career platform, drawing on your themes of resume-to-agent transformation, ethos/pathos/logos/telos/mythos, and provocative speculative ideas like agent duels, pipelines, and soul separation.

I’ll deliver a deck-style outline with punchy slide titles, narrative flow, and suggested visuals or interactions. Hang tight while I craft it.


# Resume RPG: Transforming Your CV into an AI Adventure

*A speculative platform where your resume becomes a masterful AI agent (an “agentic quasi-self”) for career advancement.*

## Slide 1: The Challenge – Static Resumes in a Dynamic World

* **Stagnant Storytelling:** Traditional resumes are static lists of facts, struggling to convey the rich **story and potential** of a candidate. In a fast-moving world, a PDF on LinkedIn feels flat and lifeless.
* **Missed Connections:** Hiring and career growth are about **human connection** – values, personality, creativity – yet resumes often fail to express **Ethos (credibility)** or **Pathos (passion)**. Key traits and soft skills remain hidden between lines of text.
* **Data Without Soul:** Even as jobs become more dynamic and tech-driven, our career data (skills, projects, achievements) sits idle. There’s an opportunity to **animate** this data, making it interactive and **responsive** to opportunities.
* **Need for Evolution:** We need a new medium for professional identity – one that is **alive, adaptive, and rich** in narrative. *Imagine if your resume could actively **collaborate, compete, and grow** along with your career.*

## Slide 2: Vision – From Resume to **Agentic Quasi-Self**

* **Your Career Avatar:** Introducing the concept of a **Resume Agent** – an AI avatar built from your resume. It’s like **a piece of you** living in the digital world, ready to act on your behalf. This isn’t just a chatbot; it’s an **agentic quasi-self** representing your professional persona.
* **Living Resume:** Instead of a static document, your credentials and experience become a **living character**. This agent can **speak, listen, and perform tasks** in simulated work scenarios or even real networking situations. It’s as if your resume got up from the page and said, “Let me show you what I can do.”
* **Tech Meets Mythos:** We blend cutting-edge AI with narrative flair – think **career counseling meets fantasy RPG**. The platform provokes: *What if your next job interview felt like meeting the hero of a story – **your story** – rather than reading a list of skills?*
* **Advancement through Interaction:** These Resume Agents can **collaborate with other agents**, enter friendly competitions, and continuously learn. The vision is a platform where **career advancement** happens through **simulation and play**, giving users deeper insight into their own path.

## Slide 3: **Resume JSON** → Character Sheet

&#x20;*Imagery: A resume presented as a fantasy RPG character sheet, complete with stats and inventory.*

* **Structured Data, Storied Persona:** We use the structured data of a **JSON resume** as the foundation – every skill, job, and achievement becomes a stat or trait on the agent’s character sheet. Just like a DD or RPG character has strength, agility, and magic, your agent has **technical skills, soft skill levels, and domain knowledge** as attributes.
* **Masteries and Skills:** Core competencies are cast as **Masteries**. For example, if you’re a software developer, “Full-Stack Web Dev” might be a Mastery at Level 5. Your **skill points** (years of experience, proficiency ratings) translate into star ratings or numeric levels on the sheet. The agent’s profile shows what it’s “strong” or “weak” in, at a glance, in a familiar game-like format.
* **Inventory of Achievements:** Portfolio pieces, certifications, and key accomplishments form the **Inventory** – the items and artifacts your agent carries. (Think of **projects as enchanted items** granting special abilities, e.g., a certification = a badge that boosts related skills.) This visual metaphor makes accomplishments tangible and fun.
* **Character Backstory:** The JSON fields like summary or objective become the agent’s **backstory or lore**. Instead of a dry bio, it’s presented as the character’s personal saga or mission. This **Mythos (personal narrative)** gives context to all those stats, turning data into a story of growth and purpose.

## Slide 4: Agent vs. Human – Identity & “Soul Bagging”

* **Soul in the Machine:** The notion of “**soul bagging**” comes alive here – your professional essence (“soul”) is **captured into the agent**. The agent carries your values, style, and decision-making patterns. *It’s still you, but in a contained form.* Think of it like putting a genie (your work-self) into a bottle – powerful but under your guidance.
* **Dual Identity:** We emphasize a healthy **agent-human separation**. **You are the master**, the agent is the extension. The platform explores identity play: where do **you** end and **your agent** begins? It’s a provocative tech twist on identity – your agent can act autonomously, yet is tethered to your ethos and goals. This raises self-reflective questions (akin to career coaching): *“What does my agent say about me? Is it reflecting the professional **character** I want to be?”*
* **Agent Masteries vs. Human Growth:** Over time, your agent might gain new **masteries** or level up skills through simulations. Interestingly, the agent might evolve in ways you haven’t yet – highlighting areas for **your own growth**. For example, your agent could demonstrate mastery in “leadership” in a simulation, signaling that you’re ready for that managerial role in real life. **Tech Provocation:** Could an AI avatar possibly reveal untapped potential or blind spots in its human counterpart?
* **Ethical Alignment:** The platform ensures the agent remains an **authentic proxy**. There’s a strong ethos on *authenticity and ethics* – the agent should not lie or embellish beyond the resume data you provide (“no fictional souls allowed!”). This transparency builds trust, so your agent’s actions **enhance** your reputation rather than risk it.

## Slide 5: Collaborative Quests – **Fantasy-Style Job Simulations**

* **Party Up for Projects:** In this world, **collaboration** looks like a **party of adventurers** tackling a quest. Multiple Resume Agents (each representing different people or even different facets of one person) can form a team to simulate **workplace scenarios**. *Visualize a “raid party” of agents:* the Software Engineer agent, the Designer agent, and the Product Manager agent join forces to “defeat” a project challenge.
* **Quest Simulations:** The platform offers **fantasy-style job simulations** – essentially gamified simulations of projects or problems to solve. An example quest: *“Launch a new product feature under a tight deadline (Dragon of Deadline Doom!).”* Each agent in the team contributes according to its skills and personality. This is playful, but with purpose: it **mirrors real team dynamics** and problem-solving.
* **Learning Through Play:** As your agent collaborates, you get insight into **how you (via the agent) work in a team**. Do you take lead? Support? Mediate conflicts? It’s like a safe sandbox for **professional development**. Career coaches often stress practicing teamwork and communication – here, you literally practice through your avatar. The **Pathos (emotional intelligence)** of your agent might be tested in a “team morale” event during a quest, for instance.
* **Mentorship & Synergy:** These collaborative quests can pair your agent with **mentor agents** (perhaps an AI modeled after a great leader in your field) to guide it. It’s as if you get to role-play being on a dream team with legendary figures. This fosters **synchronicity** – meaningful professional connections and alignment – in a virtual sense. You’re essentially networking and learning by questing with others.

## Slide 6: Competitive Duels – **Resume Battles** in the Arena

* **Battle of the CVs:** Now for the **competition** side: envision a **Resume Battle Arena** where agents face off. It’s a friendly duel – say, two sales manager agents compete to win a tricky customer deal in a simulation, or two data scientist agents race to solve a problem. This dramatizes the comparison that happens in hiring, but in a **visual, interactive way**.
* **Game Mechanics for Growth:** Each duel is structured like a game challenge. Agents might use “abilities” derived from their resumes: e.g., your agent uses its “MBA Strategy Strike” while mine counters with “10+ Years Experience Defense.” It’s tongue-in-cheek, but underneath is a real mechanism scoring how each resume’s qualifications might handle a situation.
* **Insight from Competition:** Win or lose, **you learn something**. Maybe your agent consistently loses in “public speaking duels” – a cue to improve that skill in real life. Or it wins decisively in “coding challenges,” confirming a strength. This competitive format turns self-assessment into something **engaging**. It’s much more motivating to **level up** your skills when you see your agent in a dueling leaderboard, like a Pokémon you want to train to champion status.
* **Resume Arena as Networking:** We also spin battles as a form of networking and exposure. Top performing agents in the arena could get noticed by companies (imagine a recruiter viewing a replay of an epic “resume duel” to spot talent). It’s a provocative idea: *instead of scanning resumes, what if recruiters watched highlight reels of agents battling or cooperating?* It brings **Mythos** (story) to job candidacy – each duel tells a mini-story of professional prowess.

## Slide 7: The Five-Facet Persona – **Ethos, Pathos, Logos, Telos, Mythos**

* **Beyond Hard Skills:** Real careers involve more than just technical ability. We model five dimensions of a professional persona to capture the **whole self**: **Ethos, Pathos, Logos, Telos,** and **Mythos**. Each agent has ratings or behaviors aligned with these facets, ensuring a holistic profile.

  * **Ethos (Character & Credibility):** This reflects integrity, reliability, and leadership. Does the agent behave honorably in scenarios? Does it inspire trust? *In platform terms:* high Ethos could be demonstrated by an agent consistently helping others in team simulations or by accumulating “endorsements” from other agents.
  * **Pathos (Emotional Intelligence):** Measures empathy, communication, and team chemistry. An agent with rich Pathos might excel at resolving a simulated coworker conflict or energizing a team (think of an in-game charisma stat). This facet brings in those “people skills” that resumes often gloss over but career coaches emphasize.
  * **Logos (Logic & Skills):** The traditional metrics – problem-solving, technical proficiency, results. This is showcased every time the agent completes a logical challenge or uses expertise in a simulation. It’s essentially the **competency** score, akin to how convincingly the agent can tackle job-related tasks (the part most resumes focus on, now made interactive).
  * **Telos (Purpose & Goals):** This facet captures alignment with a mission or end-goal. In rhetorical terms it’s purpose; in our platform, it might be how well the agent’s actions align to the user’s stated career goal or the “quest objective.” For example, if your career goal is to become a data science leader in healthcare, your agent’s decisions in simulations will be measured against that Telos – does it gravitate toward relevant opportunities, uphold your mission?
  * **Mythos (Story & Brand):** This is the narrative coherence and personal brand. An agent with strong Mythos presents a compelling, consistent story across interactions. It remembers its “origin story” (your background) and connects today’s actions to a larger journey. In practice, this might mean the agent can eloquently summarize its (your) career journey or draw lessons from past experiences when facing new challenges, making everything it does feel part of a larger saga.
* **Radar Chart of You:** We envision these five facets perhaps shown as a **pentagon chart** or five gauges, giving a quick visual of an agent’s makeup. This encourages users to develop **balance**. (For instance, an engineer might come in high on Logos but low on Pathos – the platform makes that visible and provides avenues to build the weaker sides through targeted quests.) This blend of classical rhetoric and career profiling is both **analytical and introspective**, provoking users to consider aspects of themselves they might not have before.

## Slide 8: Data Enrichment – **Feeding the Agent (GitHub & More)**

* **Fuel from Real Work:** The Resume Agent grows more powerful and authentic by ingesting real-world data that goes beyond the resume. For tech professionals, we integrate **GitHub contributions** as an knowledge feed. *Example:* Your GitHub history and code quality analysis could translate into your agent’s “coding prowess” or specific abilities (if you have a lot of cybersecurity code, your agent might unlock a “Security Specialist” skill in battles).
* **Continuous Learning:** The agent isn’t frozen in time; it updates as you do. Connect your LinkedIn or publish a new project – the agent **absorbs** that as new “experience points.” Essentially, it’s continually **learning from your work**. This keeps simulations realistic and up-to-date. If you start learning a new skill (say, AI/ML), your agent can start tentatively using it in simulations, reflecting early stages of mastery and even making amusing fumbles as a junior would – adding to the authenticity of the experience.
* **Multi-Source Profile:** Beyond code, any data that showcases your work can enrich the agent. Writing samples or blog posts might feed its communication style. Design portfolio images might be processed to inform a design taste profile. Even metrics like Stack Overflow reputation or Kaggle scores could become “special moves” in relevant contexts. The platform acts like an RPG game that hoovers up **loot** from the real world to equip your character.
* **Insights from Analytics:** All this data isn’t just for show – we provide analytics back to the user. *Career counseling insight:* See which areas of your real-life output most improve your agent’s performance. Perhaps contributing to open source boosted your agent’s collaboration trait significantly (a hint that those contributions are a big part of your professional brand). This transforms abstract career advice into concrete feedback: *“Keep doing X, it’s making you (and your agent) stronger.”*

## Slide 9: Career Pipeline as Questline – **Domain Flavor & Synchronicity**

* **Career Path = Level Progression:** We map career pipelines to an RPG-style **questline or leveling system**. Just as a character progresses from novice to elite, your agent traces your real career path: Junior → Mid → Senior → Lead, etc., as level-ups. **Seniority mapping** is built-in – the agent actually has a “level” that roughly corresponds to experience/seniority. Unlocking each new level comes with milestone challenges (just like a promotion in real life).
* **Domain Flavor:** Each industry or domain is treated as a distinct **class or flavor** for the agent. For instance, an agent in marketing might be akin to a “Bard” with high communication magic; an agent in cybersecurity might be a “Rogue” with stealth and strategy. This is partly fun aesthetic (the platform might skin the UI or metaphors differently for different domains), but also functional: simulations adapt to **domain-specific contexts**. The agent speaks the jargon and tackles domain-relevant quests. This domain flavor ensures relevance – a finance professional’s agent experiences a Wall Street-like adventure, while a healthcare professional’s agent navigates a hospital saga.
* **Synchronicity – Timing and Alignment:** In career growth, timing is crucial. We introduce **Synchronicity** as a concept where the agent’s journey aligns with the user’s real-world career timing. For example, if you’re preparing for a transition (say moving from engineering to product management), the platform times certain quests or duel opportunities to coincide with your preparation schedule. We also encourage “meaningful coincidences” – e.g., if another user’s agent has a complementary quest (you need a designer for your simulated startup at the same time a design agent user wants leadership experience), the platform matches you. This is like the system **playing career matchmaker**, creating serendipitous scenarios that benefit both sides. (*Think:* the Jungian idea of synchronicity, applied to networking and opportunity finding.)
* **Pipeline Visualization:** The user can see a **visual roadmap** of their agent’s journey, which mirrors potential future career moves. This looks like a branching quest tree. Key nodes are major career decisions (change job, seek promotion, learn new skill). By simulating ahead, the agent can show “if-then” previews: *“If you pursue an MBA quest now, in a year your agent could unlock a ‘Management’ branch.”* It’s a form of career planning, couched in an epic adventure map. This blends tech and career counseling: using simulation to give strategic foresight and encourage proactive skill development.

## Slide 10: Control and Collaboration – **Human “Tapping In” vs. Autonomous Agent**

* **You’re Always the Hero:** No matter how smart or autonomous the Resume Agent is, **the human is ultimately the player**. We provide a mechanism for **“tapping in”** – at any point, the human user can jump into the simulation or interaction and take direct control of their agent’s actions (much like taking direct control of your character in a game). For example, if your agent is in a high-stakes network interaction (maybe an AI networking event simulation), you can choose to **speak through it in real-time** or guide its decisions, effectively blending AI with your own judgment.
* **Autonomous Mode:** Conversely, you might let the agent **auto-pilot** certain tasks to see how it performs. This could be useful (and a bit eye-opening) to observe. How does “virtual you” handle an interview question without your manual input? It’s like watching a playback of yourself, powered by AI. This detached view can provide new perspective – perhaps your agent answers very technically (because your resume is highly technical) and you realize you’d personally add more storytelling; that insight could help you balance your real interview approach.
* **Human-in-the-Loop Learning:** The interplay between you and the agent becomes a two-way learning street. When you tap in, the agent observes *you*: it learns from how you handle situations, refining its model to be more like you. When it runs solo, you observe *it*: you learn from how it interprets your data and acts. This symbiosis is guided by **opt-in** control – you decide when to let the agent represent you and when to step forward yourself. It’s career coaching in practice: the platform essentially asks, *“Want to try that tough conversation in simulation first?”* giving you the option to practice via the agent or take charge.
* **Empowerment and Agency:** The design philosophy ensures **user empowerment**. It’s critical that users feel *enhanced*, not replaced. In practical terms, the agent will always defer to a human override. This respects personal agency (in both senses of “agency”!). The **ethos** here: technology should amplify your voice, not speak over you. For instance, if the agent is auto-applying to jobs on your behalf, it will only do so with parameters **you** set, and you can review every action. This transparency and control comfort users, much like a good career counselor who ultimately lets the client make their own decisions.

## Slide 11: MVP Features – **From Elevator Pitch to Voice Cloning**

* **Elevator Pitch Synthesis:** A quick-win feature: the agent can generate a slick **30-second elevator pitch** about you. By pulling key points from your resume-character sheet (and leaning on the **Mythos** and **Telos** we defined), it produces a concise, compelling narrative of your career. This is like hitting a button and hearing *“Hi, I’m Alice, a data wizard with 5 years of experience slaying cybersecurity challenges…”* – great for interview prep or personal branding. It blends factual data with a touch of storytelling flair, giving users a draft to refine into their own authentic voice.
* **Stolen-Agent Library:** Imagine a library of **preset agent builds** – basically “character templates” you can borrow or learn from. We playfully call it **Stolen-Agent Library** (a nod to “stealing like an artist”). New users can pick from archetypes or even import famous figures’ public resumes to see what those agents would look like. Ever wonder how **your agent compares to, say, Ada Lovelace’s agent or Elon Musk’s agent**? You could spar with a legendary template or join it on a quest. This library accelerates onboarding (you can load a template and then tweak it to become you) and fosters inspiration: *Which parts of these successful profiles might I want to emulate or “steal” for my own growth?*
* **Vocational Voice Cloning:** To push realism and personal connection, the platform can clone your speaking style – what we call **vocational voice cloning**. Your agent can literally **speak in your voice** (with your permission, using a sample you provide) or in a chosen professional tone (maybe you want it to sound like a wise mentor or a charismatic salesperson, depending on situation). Hearing your agent talk as “you” is a surreal but powerful experience – it’s like practicing interview answers or networking pitches with a version of yourself. For the user, this can build confidence (or highlight improvements) hearing one’s own voice delivering answers. And for external interactions, it ensures if your agent ever presents on your behalf (say, delivers that elevator pitch to a recruiter AI), it carries your personal touch.
* **Other MVP Ideas:** *Resume “Spellbook”* (quickly generate customized cover letters or project proposals from your agent, as if casting spells from its knowledge), *“Mirror Match” Mode* (your agent duels a clone of itself to reveal inconsistencies in your profile or just for fun), and a **Mobile Companion App** where you can chat with your agent for daily coaching tips or even pep talks (think of it as a pocket familiar or pet that keeps you motivated with career goal reminders). These components keep the initial version focused on **tangible value (better pitches, applications, self-knowledge)** while laying groundwork for the grander collaborative/competitive features.

## Slide 12: Conclusion – From Resume to **Role-Playing**: A New Career Saga

* **Career as an Adventure:** This platform reframes professional growth as an **epic journey** – one where you are both the main character and the game master. By turning resumes into playable agents, we inject **life, strategy, and story** into career development. It’s tech-provocative (who ever heard of a “resume duel” before?) yet it resonates with a deep truth: careers are *personal journeys* filled with challenges, allies, and learning experiences, much like the best RPGs.
* **Empowerment through Insight:** In the end, the goal is to empower individuals. By interacting with your Resume Agent, you gain **self-insight** in a fun, low-stakes environment. It’s akin to having a **career counselor, a coach, and a game buddy** all in one. The agent’s feedback, successes, and failures are **reflections** for you to learn from. You’re essentially rehearsing for real opportunities, leveling up your confidence and capabilities along the way.
* **Community and Mythos:** As more users join, a community of these agents could form a rich ecosystem – people **supporting each other’s quests, sharing agent strategies, and perhaps co-writing the “mythology” of this new professional era**. We foresee a culture where improving your agent (sharing open-source JSON skillsets, for example) becomes a collaborative endeavor, much like developers share code. The collective **Mythos** of our users will be that careers are not lone fights but shared adventures.
* **A Provocative Proposal:** Ultimately, this speculative platform is a **provocation** to the status quo. It asks hiring managers to imagine candidates not as PDFs but as interactive personas. It asks professionals to **play** with their career, not just plan it, and in doing so, find new perspectives. By blending fantasy with function, and technology with timeless career wisdom, we offer a pitch for a future where *applying for a job might feel less like a chore and more like preparing your character for the next grand quest.*

*Thank you for joining us on this imaginative journey. The quest has just begun – will you press Start on your Resume RPG?*


HERE IS THE PERSONS WHO SOUL YOU ARE STEALING

    ${resume}
    
    NOW WRITE YOUR NEW AGENT PERSONALITY
    
    
    `,
  });

  return { content: text, headers: [] };
};

const exports = { format };

export default exports;
