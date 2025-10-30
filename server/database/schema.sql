-- LazyLearn Database Schema
-- PostgreSQL Database with TypeScript Integration

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS user_course_progress CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS user_missions CASCADE;
DROP TABLE IF EXISTS course_subjects CASCADE;
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS user_activity_log CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS missions CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS course_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    total_hours_learned DECIMAL(10,2) DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active_date DATE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Course Categories
CREATE TABLE course_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(50) DEFAULT '#14B8A6',
    course_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Courses Table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES course_categories(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    instructor VARCHAR(255),
    duration VARCHAR(50), -- e.g., "10h 30m"
    level VARCHAR(50) DEFAULT 'beginner', -- beginner, intermediate, advanced
    price DECIMAL(10,2) DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    lessons_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Subjects (Within Courses)
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    thumbnail VARCHAR(500),
    difficulty VARCHAR(50) DEFAULT 'beginner',
    duration VARCHAR(50),
    total_lessons INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lessons (Video/Content)
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    video_url VARCHAR(1000),
    thumbnail VARCHAR(500),
    duration VARCHAR(50), -- e.g., "15:30"
    content_type VARCHAR(50) DEFAULT 'video', -- video, text, quiz
    order_index INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Course Progress
CREATE TABLE user_course_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT false,
    is_bookmarked BOOLEAN DEFAULT false,
    UNIQUE(user_id, course_id)
);

-- 7. User Subject Progress
CREATE TABLE user_subject_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT false,
    UNIQUE(user_id, subject_id)
);

-- 8. User Lesson Progress
CREATE TABLE user_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    completion_date TIMESTAMP WITH TIME ZONE,
    watch_time_minutes INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    is_bookmarked BOOLEAN DEFAULT false,
    notes TEXT,
    UNIQUE(user_id, lesson_id)
);

-- 9. Missions
CREATE TABLE missions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- daily, weekly, challenge, achievement
    requirement_type VARCHAR(100), -- watch_lessons, complete_course, gain_exp
    requirement_value INTEGER DEFAULT 1,
    reward_points INTEGER DEFAULT 0,
    reward_badge VARCHAR(255),
    difficulty VARCHAR(50) DEFAULT 'easy', -- easy, medium, hard
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. User Missions
CREATE TABLE user_missions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    mission_id INTEGER REFERENCES missions(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, expired
    progress_value INTEGER DEFAULT 0,
    requirement_value INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    rewards_claimed BOOLEAN DEFAULT false,
    UNIQUE(user_id, mission_id)
);

-- 11. Achievements
CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    badge_color VARCHAR(50) DEFAULT '#F59E0B',
    type VARCHAR(100), -- first_course, streak_warrior, expert_learner
    requirement_type VARCHAR(100),
    requirement_value INTEGER DEFAULT 1,
    reward_points INTEGER DEFAULT 0,
    is_secret BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. User Achievements
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- 13. User Activity Log
CREATE TABLE user_activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL, -- login, lesson_start, lesson_complete, course_enroll
    related_id INTEGER, -- Can reference lesson_id, course_id, etc.
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. User Sessions (Optional - for Redis alternative)
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_subjects_course ON subjects(course_id);
CREATE INDEX idx_lessons_subject ON lessons(subject_id);
CREATE INDEX idx_user_course_progress_user ON user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course ON user_course_progress(course_id);
CREATE INDEX idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX idx_user_missions_user ON user_missions(user_id);
CREATE INDEX idx_user_missions_status ON user_missions(status);
CREATE INDEX idx_user_activity_log_user ON user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created ON user_activity_log(created_at);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);

-- Updated At Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_categories_updated_at BEFORE UPDATE ON course_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data for Testing
INSERT INTO course_categories (name, description, icon, color) VALUES
('Programming', 'Learn programming languages and development', '💻', '#3B82F6'),
('Design', 'UI/UX and graphic design courses', '🎨', '#EC4899'),
('Business', 'Business and entrepreneurship skills', '💼', '#8B5CF6'),
('Language', 'Foreign language learning', '🌍', '#10B981'),
('Science', 'Science and mathematics courses', '🔬', '#F59E0B');

INSERT INTO courses (category_id, title, description, instructor, duration, level, price, rating, students_count, is_published) VALUES
(1, 'Introduction to TypeScript', 'Learn TypeScript from scratch with practical examples', 'John Developer', '8h 30m', 'beginner', 49.99, 4.7, 15234, true),
(1, 'Advanced React Patterns', 'Master advanced React patterns and best practices', 'Sarah React', '12h 15m', 'advanced', 89.99, 4.9, 8921, true),
(2, 'UI/UX Design Fundamentals', 'Learn the principles of user interface and experience design', 'Emily Designer', '15h 45m', 'beginner', 79.99, 4.6, 12456, true),
(3, 'Digital Marketing Strategy', 'Complete guide to digital marketing and growth', 'Mike Business', '10h 20m', 'intermediate', 69.99, 4.5, 9876, true);

INSERT INTO achievements (title, description, icon, type, requirement_type, requirement_value, reward_points) VALUES
('First Steps', 'Complete your first lesson', '🎯', 'first_lesson', 'complete_lesson', 1, 50),
('Course Graduate', 'Complete your first course', '🎓', 'first_course', 'complete_course', 1, 200),
('Week Warrior', 'Maintain a 7-day learning streak', '🔥', 'streak', 'streak_days', 7, 100),
('Knowledge Seeker', 'Complete 10 lessons', '📚', 'lessons_count', 'complete_lessons', 10, 150),
('Expert Learner', 'Reach level 10', '⭐', 'level', 'user_level', 10, 500);

INSERT INTO missions (title, description, type, requirement_type, requirement_value, reward_points, difficulty) VALUES
('Daily Learning', 'Complete at least 1 lesson today', 'daily', 'complete_lessons', 1, 25, 'easy'),
('Weekly Challenge', 'Complete 5 lessons this week', 'weekly', 'complete_lessons', 5, 100, 'medium'),
('Course Explorer', 'Enroll in a new course', 'challenge', 'enroll_course', 1, 50, 'easy'),
('Dedicated Learner', 'Spend 2 hours learning today', 'daily', 'time_spent', 120, 75, 'medium');