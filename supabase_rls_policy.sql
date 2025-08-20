-- Deaktivieren Sie RLS vorübergehend, um alle Richtlinien zu löschen
    ALTER TABLE nava_user_authentication DISABLE ROW LEVEL SECURITY;

    -- Löschen Sie alle vorhandenen RLS-Richtlinien für diese Tabelle
    DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON nava_user_authentication;
    -- Fügen Sie hier weitere DROP POLICY-Befehle hinzu, falls Sie andere Richtlinien für diese Tabelle erstellt haben

    -- Aktivieren Sie RLS wieder
    ALTER TABLE nava_user_authentication ENABLE ROW LEVEL SECURITY;

    -- Erstellen Sie die Richtlinie, die authentifizierten Benutzern das Einfügen ihres eigenen Profils erlaubt
    CREATE POLICY "Allow authenticated users to insert their own profile"
    ON nava_user_authentication
    FOR INSERT
    WITH CHECK (auth.uid() = id);