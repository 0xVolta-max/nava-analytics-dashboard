-- Zuerst den bestehenden Trigger löschen, falls vorhanden
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Dann die bestehende Funktion löschen, falls vorhanden
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Funktion zum Erstellen eines Profils für neue Benutzer
-- Fügt user_id, email, created_at und updated_at ein
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.nava_user_authentication (user_id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now()); -- 'now()' setzt den aktuellen Zeitstempel
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger, der die Funktion aufruft, nachdem ein neuer Benutzer in auth.users eingefügt wurde
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();