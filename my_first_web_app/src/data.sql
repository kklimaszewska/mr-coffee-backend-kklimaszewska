-- schedules

CREATE TABLE schedules (
    id          serial      PRIMARY KEY,
    user_id     INT         NOT NULL,
    day         INT         NOT NULL,
    start_at    INT         NOT NULL,
    end_at      INT         NOT NULL
);

INSERT INTO schedules (user_id, day, start_at, end_at) VALUES
    (0, 1, 14, 16),
    (0, 2, 14, 16),
    (0, 3, 14, 16),
    (2, 5, 8, 18);
