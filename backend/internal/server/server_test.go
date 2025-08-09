package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
)

func setup(t *testing.T) (*Server, sqlmock.Sqlmock) {
	gin.SetMode(gin.TestMode)
	db, mock, err := sqlmock.New()
	if err != nil { t.Fatalf("mock: %v", err) }
	s := &Server{db: db, router: gin.New()}
	s.router.Use(gin.Recovery())
	s.routes()
	return s, mock
}

func TestHealth(t *testing.T) {
	s, _ := setup(t)
	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()
	s.router.ServeHTTP(w, req)
	if w.Code != 200 { t.Fatalf("status %d", w.Code) }
}

func TestCreateAndListMembers(t *testing.T) {
	s, mock := setup(t)
	mock.ExpectExec("INSERT INTO members").WithArgs("Jane", "j@a.com", "").WillReturnResult(sqlmock.NewResult(1, 1))
	body, _ := json.Marshal(map[string]any{"name":"Jane","email":"j@a.com","pictureUrl":""})
	w := httptest.NewRecorder()
	s.router.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/members", bytes.NewReader(body)))
	if w.Code != 201 { t.Fatalf("status %d", w.Code) }

	rows := sqlmock.NewRows([]string{"id","name","email","picture_url"}).AddRow(1, "Jane", "j@a.com", "")
	mock.ExpectQuery("SELECT id,name,email,picture_url FROM members").WillReturnRows(rows)
	w2 := httptest.NewRecorder()
	s.router.ServeHTTP(w2, httptest.NewRequest(http.MethodGet, "/members", nil))
	if w2.Code != 200 { t.Fatalf("status %d", w2.Code) }
}

func TestCreateAndListTeams(t *testing.T) {
	s, mock := setup(t)
	mock.ExpectExec("INSERT INTO teams").WithArgs("Alpha", "").WillReturnResult(sqlmock.NewResult(1, 1))
	body, _ := json.Marshal(map[string]any{"name":"Alpha","logoUrl":""})
	w := httptest.NewRecorder()
	s.router.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/teams", bytes.NewReader(body)))
	if w.Code != 201 { t.Fatalf("status %d", w.Code) }

	rows := sqlmock.NewRows([]string{"id","name","logo_url"}).AddRow(1, "Alpha", "")
	mock.ExpectQuery("SELECT id,name,logo_url FROM teams").WillReturnRows(rows)
	w2 := httptest.NewRecorder()
	s.router.ServeHTTP(w2, httptest.NewRequest(http.MethodGet, "/teams", nil))
	if w2.Code != 200 { t.Fatalf("status %d", w2.Code) }
}

func TestAssignMember(t *testing.T) {
	s, mock := setup(t)
	mock.ExpectExec("INSERT IGNORE INTO team_members").WithArgs(int64(1), int64(2)).WillReturnResult(sqlmock.NewResult(0, 1))
	body, _ := json.Marshal(map[string]any{"memberId":1,"teamId":2})
	w := httptest.NewRecorder()
	s.router.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/assign", bytes.NewReader(body)))
	if w.Code != 204 { t.Fatalf("status %d", w.Code) }
}

func TestFeedbackFlow(t *testing.T) {
	s, mock := setup(t)
	mock.ExpectExec("INSERT INTO feedbacks").WithArgs("member", int64(1), "Great").WillReturnResult(sqlmock.NewResult(1, 1))
	w := httptest.NewRecorder()
	b, _ := json.Marshal(map[string]any{"targetType":"member","targetId":1,"content":"Great"})
	s.router.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/feedback", bytes.NewReader(b)))
	if w.Code != 201 { t.Fatalf("status %d", w.Code) }

	rows := sqlmock.NewRows([]string{"id","target_type","target_id","content","created_at"}).AddRow(1, "member", 1, "Great", time.Now())
	mock.ExpectQuery("SELECT id,target_type,target_id,content,created_at FROM feedbacks").WillReturnRows(rows)
	w2 := httptest.NewRecorder()
	s.router.ServeHTTP(w2, httptest.NewRequest(http.MethodGet, "/feedback", nil))
	if w2.Code != 200 { t.Fatalf("status %d", w2.Code) }
}

func TestRelations(t *testing.T) {
	s, mock := setup(t)
	rowsTeams := sqlmock.NewRows([]string{"id","name","logo_url"}).AddRow(2, "T", "")
	mock.ExpectQuery("SELECT t.id,t.name,t.logo_url FROM teams t JOIN team_members tm").WillReturnRows(rowsTeams)
	w := httptest.NewRecorder()
	s.router.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/members/1/teams", nil))
	if w.Code != 200 { t.Fatalf("status %d", w.Code) }

	rowsMembers := sqlmock.NewRows([]string{"id","name","email","picture_url"}).AddRow(1, "Jane", "j@a.com", "")
	mock.ExpectQuery("SELECT m.id,m.name,m.email,m.picture_url FROM members m JOIN team_members tm").WillReturnRows(rowsMembers)
	w2 := httptest.NewRecorder()
	s.router.ServeHTTP(w2, httptest.NewRequest(http.MethodGet, "/teams/2/members", nil))
	if w2.Code != 200 { t.Fatalf("status %d", w2.Code) }
}
