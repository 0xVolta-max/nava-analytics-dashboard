-- Zuerst den bestehenden Trigger löschen, falls vorhanden
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Dann die bestehende Funktion löschen, falls vorhanden
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Funktion zum Erstellen eines Profils für neue Benutzer
-- Fügt alle Spalten mit Standardwerten ein
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Debug: Logge die eingehenden Daten
  RAISE NOTICE 'Creating user profile for: %', NEW.email;

  INSERT INTO public.nava_user_authentication (
    user_id,
    email,
    username,
    password_hash,
    salt,
    first_name,
    last_name,
    profile_picture_url,
    email_verified,
    is_active,
    last_login,
    login_attempts,
    locked_until,
    reset_token,
    reset_token_expires,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email, -- Verwende Email als einzigartigen Username
    '', -- Standardwert für password_hash (WARNUNG: Dies ist ein Platzhalter. Wenn Sie Passwörter hier verwalten, muss dies korrekt gehandhabt werden.)
    '', -- Standardwert für salt (WARNUNG: Dies ist ein Platzhalter.)
    '', -- Standardwert für first_name
    '', -- Standardwert für last_name
    NULL, -- Standardwert für profile_picture_url (NULL, wenn nullable, sonst '')
    FALSE, -- Standardwert für email_verified (Supabase Auth verwaltet dies, aber hier für NOT NULL gesetzt)
    TRUE, -- Standardwert für is_active
    NULL, -- Standardwert für last_login (NULL, wenn nullable, sonst now())
    0, -- Standardwert für login_attempts
    NULL, -- Standardwert für locked_until (NULL, wenn nullable)
    NULL, -- Standardwert für reset_token (NULL, wenn nullable)
    NULL, -- Standardwert für reset_token_expires (NULL, wenn nullable)
    now(), -- Standardwert für created_at
    now()  -- Standardwert für updated_at
  );

  RAISE NOTICE 'User profile created successfully for: %', NEW.email;
  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Bei Fehlern: Logge den Fehler und lasse den User trotzdem erstellen
    RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger, der die Funktion aufruft, nachdem ein neuer Benutzer in auth.users eingefügt wurde
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
