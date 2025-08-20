-- Deaktivieren Sie RLS vorübergehend, um die alte Richtlinie zu löschen
    ALTER TABLE nava_user_authentication DISABLE ROW LEVEL SECURITY;

    -- Löschen Sie die alte Richtlinie, die auf die 'id'-Spalte verwiesen hat
    DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON nava_user_authentication;

    -- Aktivieren Sie RLS wieder
    ALTER TABLE nava_user_authentication ENABLE ROW LEVEL SECURITY;

    -- Erstellen Sie die NEUE Richtlinie, die authentifizierten Benutzern das Einfügen ihres eigenen Profils erlaubt
    -- und dabei die umbenannte 'user_id'-Spalte verwendet
    CREATE POLICY "Allow authenticated users to insert their own profile"
    ON nava_user_authentication
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);