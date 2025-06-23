CREATE TABLE communes (
  id BIGINT PRIMARY KEY DEFAULT (
    floor(random() * 8000000000000000 + 1000000000000000)::BIGINT
  ),
  name TEXT NOT NULL,
  name_ar TEXT,
  wilaya_id BIGINT NOT NULL REFERENCES wilaya(id) ON DELETE CASCADE,
  daira_id BIGINT NOT NULL REFERENCES daira(id) ON DELETE CASCADE,
  UNIQUE(name, daira_id, wilaya_id)
);