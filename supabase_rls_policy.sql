CREATE POLICY "Allow authenticated users to insert their own profile"
    ON nava_user_authentication
    FOR INSERT
    WITH CHECK (auth.uid() = id);