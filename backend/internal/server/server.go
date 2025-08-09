package server

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

type Server struct {
	db     *sql.DB
	router *gin.Engine
}

type Member struct {
	ID         int64  `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	PictureURL string `json:"pictureUrl"`
}

type Team struct {
	ID      int64  `json:"id"`
	Name    string `json:"name"`
	LogoURL string `json:"logoUrl"`
}

type Feedback struct {
	ID         int64     `json:"id"`
	TargetType string    `json:"targetType"`
	TargetID   int64     `json:"targetId"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"createdAt"`
}

type createMemberReq struct {
	Name       string `json:"name"`
	Email      string `json:"email"`
	PictureURL string `json:"pictureUrl"`
}

type createTeamReq struct {
	Name    string `json:"name"`
	LogoURL string `json:"logoUrl"`
}

type assignReq struct {
	MemberID int64 `json:"memberId"`
	TeamID   int64 `json:"teamId"`
}

type feedbackReq struct {
	TargetType string `json:"targetType"`
	TargetID   int64  `json:"targetId"`
	Content    string `json:"content"`
}

func New(dsn string) (*Server, error) {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(gin.Recovery())
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)
	if err := migrate(db); err != nil {
		return nil, err
	}
	s := &Server{db: db, router: r}
	s.routes()
	return s, nil
}

func (s *Server) Start(addr string) error {
	return s.router.Run(addr)
}

func migrate(db *sql.DB) error {
	stmts := []string{
		"CREATE TABLE IF NOT EXISTS members (id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, picture_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
		"CREATE TABLE IF NOT EXISTS teams (id BIGINT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255) NOT NULL, logo_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
		"CREATE TABLE IF NOT EXISTS team_members (member_id BIGINT NOT NULL, team_id BIGINT NOT NULL, UNIQUE KEY uq_member_team(member_id, team_id))",
		"CREATE TABLE IF NOT EXISTS feedbacks (id BIGINT PRIMARY KEY AUTO_INCREMENT, target_type VARCHAR(16) NOT NULL, target_id BIGINT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
	}
	for _, s := range stmts {
		if _, err := db.Exec(s); err != nil {
			return err
		}
	}
	return nil
}

func (s *Server) routes() {
	s.router.GET("/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"ok": true}) })
	s.router.POST("/members", s.createMember)
	s.router.GET("/members", s.listMembers)
	s.router.POST("/teams", s.createTeam)
	s.router.GET("/teams", s.listTeams)
	s.router.POST("/assign", s.assignMember)
	s.router.POST("/feedback", s.createFeedback)
	s.router.GET("/feedback", s.listFeedback)
	ss := s.router.Group("/members")
	ss.GET(":id/teams", s.memberTeams)
	ts := s.router.Group("/teams")
	ts.GET(":id/members", s.teamMembers)
}

func (s *Server) createMember(c *gin.Context) {
	var req createMemberReq
	if err := c.BindJSON(&req); err != nil || len(req.Name) < 2 || len(req.Email) < 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid"})
		return
	}
	res, err := s.db.Exec("INSERT INTO members(name,email,picture_url) VALUES(?,?,?)", req.Name, req.Email, req.PictureURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	id, _ := res.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (s *Server) listMembers(c *gin.Context) {
	rows, err := s.db.Query("SELECT id,name,email,picture_url FROM members ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	defer rows.Close()
	var out []Member
	for rows.Next() {
		var m Member
		if err := rows.Scan(&m.ID, &m.Name, &m.Email, &m.PictureURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
			return
		}
		out = append(out, m)
	}
	c.JSON(http.StatusOK, out)
}

func (s *Server) createTeam(c *gin.Context) {
	var req createTeamReq
	if err := c.BindJSON(&req); err != nil || len(req.Name) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid"})
		return
	}
	res, err := s.db.Exec("INSERT INTO teams(name,logo_url) VALUES(?,?)", req.Name, req.LogoURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	id, _ := res.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

func (s *Server) listTeams(c *gin.Context) {
	rows, err := s.db.Query("SELECT id,name,logo_url FROM teams ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	defer rows.Close()
	var out []Team
	for rows.Next() {
		var t Team
		if err := rows.Scan(&t.ID, &t.Name, &t.LogoURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
			return
		}
		out = append(out, t)
	}
	c.JSON(http.StatusOK, out)
}

func (s *Server) assignMember(c *gin.Context) {
	var req assignReq
	if err := c.BindJSON(&req); err != nil || req.MemberID <= 0 || req.TeamID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid"})
		return
	}
	_, err := s.db.Exec("INSERT IGNORE INTO team_members(member_id,team_id) VALUES(?,?)", req.MemberID, req.TeamID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	c.Status(http.StatusNoContent)
}

func (s *Server) createFeedback(c *gin.Context) {
	var req feedbackReq
	if err := c.BindJSON(&req); err != nil || (req.TargetType != "member" && req.TargetType != "team") || req.TargetID <= 0 || len(req.Content) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid"})
		return
	}
	_, err := s.db.Exec("INSERT INTO feedbacks(target_type,target_id,content) VALUES(?,?,?)", req.TargetType, req.TargetID, req.Content)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	c.Status(http.StatusCreated)
}

func (s *Server) listFeedback(c *gin.Context) {
	rows, err := s.db.Query("SELECT id,target_type,target_id,content,created_at FROM feedbacks ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	defer rows.Close()
	var out []Feedback
	for rows.Next() {
		var f Feedback
		if err := rows.Scan(&f.ID, &f.TargetType, &f.TargetID, &f.Content, &f.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
			return
		}
		out = append(out, f)
	}
	c.JSON(http.StatusOK, out)
}

func (s *Server) memberTeams(c *gin.Context) {
	id := c.Param("id")
	rows, err := s.db.Query("SELECT t.id,t.name,t.logo_url FROM teams t JOIN team_members tm ON tm.team_id=t.id WHERE tm.member_id=? ORDER BY t.id DESC", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	defer rows.Close()
	var out []Team
	for rows.Next() {
		var t Team
		if err := rows.Scan(&t.ID, &t.Name, &t.LogoURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
			return
		}
		out = append(out, t)
	}
	c.JSON(http.StatusOK, out)
}

func (s *Server) teamMembers(c *gin.Context) {
	id := c.Param("id")
	rows, err := s.db.Query("SELECT m.id,m.name,m.email,m.picture_url FROM members m JOIN team_members tm ON tm.member_id=m.id WHERE tm.team_id=? ORDER BY m.id DESC", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
		return
	}
	defer rows.Close()
	var out []Member
	for rows.Next() {
		var m Member
		if err := rows.Scan(&m.ID, &m.Name, &m.Email, &m.PictureURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "db"})
			return
		}
		out = append(out, m)
	}
	c.JSON(http.StatusOK, out)
}
