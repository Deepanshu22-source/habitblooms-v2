-- Security & RLS Hardening for HabitBlooms (zqljzgavhywxvrrrbhxh)
-- 1. Harden trigger & RPC SECURITY DEFINER functions (fixed search_path, revoke anon/public, self-referral & atomic protection)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, score, seeds, streak, streak_freezes, plant_stage, plant_health)
  VALUES (new.id, 0, 0, 0, 0, 1, 100);
  RETURN new;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.reward_referrer(referrer_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  secure_new_user_id uuid;
  updated_user_id uuid;
BEGIN
  secure_new_user_id := auth.uid();

  IF secure_new_user_id IS NULL OR referrer_uuid IS NULL OR referrer_uuid = secure_new_user_id THEN
    RETURN;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = referrer_uuid) THEN
    RETURN;
  END IF;

  UPDATE public.profiles
  SET referred_by = referrer_uuid
  WHERE id = secure_new_user_id
    AND referred_by IS NULL
  RETURNING id INTO updated_user_id;

  IF updated_user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET seeds = COALESCE(seeds, 0) + 1000
    WHERE id = referrer_uuid;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.reward_referrer(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reward_referrer(uuid) TO authenticated, service_role;

-- 2. Restrict anon & excess table grants on all user/gamification tables
REVOKE ALL ON TABLE
  public.habits,
  public.habit_completions,
  public.todos,
  public.push_subscriptions,
  public.profiles,
  public.activity_feed,
  public.feedback
FROM anon;

REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLE
  public.habits,
  public.habit_completions,
  public.todos,
  public.push_subscriptions,
  public.profiles,
  public.activity_feed,
  public.feedback
FROM authenticated;

-- 3. Harden & optimize RLS policies (TO authenticated, (select auth.uid()), WITH CHECK on UPDATE)
ALTER POLICY "Users can view own habits" ON public.habits TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY "Users can insert own habits" ON public.habits TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY "Users can update own habits" ON public.habits TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY "Users can delete own habits" ON public.habits TO authenticated USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can view own completions" ON public.habit_completions TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY "Users can insert own completions" ON public.habit_completions TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY "Users can delete own completions" ON public.habit_completions TO authenticated USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can view own todos" ON public.todos TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY "Users can insert own todos" ON public.todos TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY "Users can update own todos" ON public.todos TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY "Users can delete own todos" ON public.todos TO authenticated USING ((select auth.uid()) = user_id);

ALTER POLICY "Users can insert own push subscriptions" ON public.push_subscriptions TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY "Users can update own push subscriptions" ON public.push_subscriptions TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can view own push subscriptions" ON public.push_subscriptions FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own push subscriptions" ON public.push_subscriptions FOR DELETE TO authenticated USING ((select auth.uid()) = user_id);

ALTER POLICY "Profiles are viewable by everyone" ON public.profiles TO authenticated USING (true);
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
ALTER POLICY "Users can insert their own profile" ON public.profiles TO authenticated WITH CHECK ((select auth.uid()) = id);
ALTER POLICY "Users can update own profile" ON public.profiles TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

ALTER POLICY "Anyone can view activity feed" ON public.activity_feed TO authenticated USING (true);
ALTER POLICY "Users can insert own feed" ON public.activity_feed TO authenticated WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Users can insert their own feedback" ON public.feedback TO authenticated WITH CHECK ((select auth.uid()) = user_id);

-- 4. Covering indexes for foreign keys
CREATE INDEX IF NOT EXISTS activity_feed_user_id_idx ON public.activity_feed(user_id);
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON public.todos(user_id);
