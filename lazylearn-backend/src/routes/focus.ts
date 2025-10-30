
import { Router } from 'express';

const router = Router();

// Middleware to parse JSON bodies
router.use(Router.json());

/**
 * @route POST /api/focus/session
 * @desc Create a new focus session and invite friends
 */
router.post('/session', (req, res) => {
  // const { lessonId, durationSet, musicTrack, friendIds } = req.body;
  console.log('Creating a new focus session...');
  // TODO: Add Kysely logic to insert into FocusSession and FocusSessionParticipant
  res.status(201).json({ message: 'Session created successfully', sessionId: 'new-session-id' });
});

/**
 * @route GET /api/focus/session/:sessionId
 * @desc Get session details and participants
 */
router.get('/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  console.log(`Fetching details for session: ${sessionId}`);
  // TODO: Add Kysely logic to query session and participants
  res.status(200).json({ sessionId, participants: [] });
});

/**
 * @route POST /api/focus/session/:sessionId/start
 * @desc Start the focus session timer
 */
router.post('/session/:sessionId/start', async (req, res) => {
  const { sessionId } = req.params;
  console.log(`Starting session: ${sessionId}`);

  // TODO: Add Kysely logic to update session status to 'active'
  const sessionDetails = { startTime: new Date(), durationSet: 3600 }; // Dummy data

  // In a real app, you would get the realtimeService instance
  // (e.g., via middleware attaching it to `req`, or a singleton).
  // For example: const realtimeService = req.app.get('realtimeService');
  // await realtimeService.publishEvent(sessionId, 'TIMER_START', { 
  //   startTime: sessionDetails.startTime, 
  //   durationSet: sessionDetails.durationSet 
  // });
  console.log('Conceptually publishing TIMER_START to Redis...');

  res.status(200).json({ message: 'Session started' });
});

/**
 * @route POST /api/focus/session/:sessionId/end
 * @desc End the focus session and log stats
 */
router.post('/session/:sessionId/end', (req, res) => {
  const { sessionId } = req.params;
  console.log(`Ending session: ${sessionId}`);
  // TODO: Update session status to 'completed'
  // TODO: Calculate durationFocused and update FocusSession
  // TODO: Update or create DailyFocusLog for each participant
  res.status(200).json({ message: 'Session ended and stats logged' });
});

/**
 * @route PUT /api/focus/invite/:sessionId/accept
 * @desc Accept an invitation to a focus session
 */
router.put('/invite/:sessionId/accept', (req, res) => {
  const { sessionId } = req.params;
  // const { userId } = req.body; // Assuming userId is sent in the body
  console.log(`Accepting invite for session: ${sessionId}`);
  // TODO: Update FocusSessionParticipant status to 'accepted'
  res.status(200).json({ message: 'Invite accepted' });
});

/**
 * @route GET /api/focus/stats/daily
 * @desc Get today's total focus time for the user
 */
router.get('/stats/daily', (req, res) => {
  // const { userId } = req.query; // Assuming userId is passed as a query param
  console.log('Fetching daily stats...');
  // TODO: Add Kysely logic to query DailyFocusLog
  res.status(200).json({ totalSecondsToday: 0 });
});

export default router;
