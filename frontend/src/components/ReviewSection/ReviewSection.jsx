import { useState } from 'react';
import { FaStar, FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useReviews } from '../../hooks/useReviews.js';

// ─── Star Picker ──────────────────────────────────────────────────────────────
function StarPicker({ value, onChange, size = 28, readonly = false }) {
  const [hovered, setHovered] = useState(null);
  const active = hovered ?? value ?? 0;

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          size={size}
          style={{
            cursor: readonly ? 'default' : 'pointer',
            transition: 'color 0.12s, transform 0.12s',
            transform: !readonly && s <= active ? 'scale(1.15)' : 'scale(1)',
            color: s <= active ? '#f59e0b' : '#d1d5db',
          }}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(null)}
          onClick={() => !readonly && onChange && onChange(s)}
        />
      ))}
    </div>
  );
}

// ─── Distribution Bar ─────────────────────────────────────────────────────────
function DistributionBar({ distribution, total }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {distribution.map(({ star, count }) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ width: 8, color: '#6b7280' }}>{star}</span>
            <FaStar size={12} color="#f59e0b" />
            <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  borderRadius: 4,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
            <span style={{ width: 28, color: '#9ca3af', textAlign: 'right' }}>{count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Review Form ──────────────────────────────────────────────────────────────
function ReviewForm({ initial, onSubmit, onCancel, submitting }) {
  const [stars, setStars] = useState(initial?.stars ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!stars) return alert('Selecione uma nota de 1 a 5 estrelas.');
    if (!comment.trim()) return alert('Escreva um comentário.');
    onSubmit({ stars, comment });
  };

  const remaining = 500 - comment.length;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <p style={styles.formLabel}>Sua avaliação</p>
      <StarPicker value={stars} onChange={setStars} size={32} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 500))}
        placeholder="Escreva seu comentário sobre este post..."
        rows={4}
        style={styles.textarea}
      />
      <span style={{ fontSize: 12, color: remaining < 50 ? '#ef4444' : '#9ca3af', alignSelf: 'flex-end' }}>
        {remaining} caracteres restantes
      </span>

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button type="submit" disabled={submitting} style={styles.btnPrimary}>
          {submitting ? 'Salvando…' : initial ? 'Salvar alterações' : 'Publicar avaliação'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.btnSecondary}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

// ─── Single Review Card ───────────────────────────────────────────────────────
function ReviewCard({ review, isOwner, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const name = review.user?.name || 'Usuário';
  const avatar = review.user?.avatar;
  const timeAgo = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true, locale: ptBR });

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {avatar ? (
            <img src={avatar} alt={name} style={styles.avatar} />
          ) : (
            <FaUserCircle size={36} color="#d1d5db" />
          )}
          <div>
            <p style={styles.cardName}>{name}</p>
            <p style={styles.cardTime}>{timeAgo}</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StarPicker value={review.stars} readonly size={16} />
          {isOwner && !confirmDelete && (
            <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
              <button onClick={onEdit} style={styles.iconBtn} title="Editar">
                <FaEdit size={14} color="#6b7280" />
              </button>
              <button onClick={() => setConfirmDelete(true)} style={styles.iconBtn} title="Deletar">
                <FaTrash size={14} color="#ef4444" />
              </button>
            </div>
          )}
          {isOwner && confirmDelete && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 8 }}>
              <span style={{ fontSize: 12, color: '#ef4444' }}>Confirmar?</span>
              <button onClick={onDelete} style={{ ...styles.iconBtn, background: '#fef2f2' }}>
                <FaTrash size={13} color="#ef4444" />
              </button>
              <button onClick={() => setConfirmDelete(false)} style={styles.iconBtn}>
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
      <p style={styles.cardComment}>{review.comment}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * Props:
 *   postId     — string  (ID do post no MongoDB)
 *   isLoggedIn — boolean (usuário está autenticado?)
 *   currentUserId — string | null (ID do usuário logado, para identificar dono)
 */
export default function ReviewSection({ postId, isLoggedIn, currentUserId }) {
  const {
    reviews, average, total, distribution,
    myReview, loading, submitting, error,
    page, pages,
    submitReview, editReview, deleteReview,
    fetchReviews,
  } = useReviews(postId, isLoggedIn);

  const [editing, setEditing] = useState(false);

  const handleSubmit = async (data) => {
    const res = await submitReview(data);
    if (res.success) setEditing(false);
  };

  const handleEdit = async (data) => {
    const res = await editReview(myReview._id, data);
    if (res.success) setEditing(false);
  };

  const handleDelete = async () => {
    await deleteReview(myReview._id);
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>Avaliações</h2>

      {/* ── Resumo ── */}
      {total > 0 && (
        <div style={styles.summary}>
          <div style={styles.summaryScore}>
            <span style={styles.bigScore}>{average}</span>
            <StarPicker value={Math.round(average)} readonly size={22} />
            <span style={styles.totalText}>{total} avaliação{total !== 1 ? 'ões' : ''}</span>
          </div>
          <div style={styles.summaryBars}>
            <DistributionBar distribution={distribution} total={total} />
          </div>
        </div>
      )}

      {/* ── Formulário / Meu review ── */}
      {isLoggedIn && (
        <div style={styles.myReviewBox}>
          {!myReview && !editing && (
            <>
              <p style={styles.formLabel}>Deixe sua avaliação</p>
              <ReviewForm onSubmit={handleSubmit} submitting={submitting} />
            </>
          )}

          {myReview && !editing && (
            <div>
              <p style={{ ...styles.formLabel, marginBottom: 8 }}>Sua avaliação</p>
              <ReviewCard
                review={myReview}
                isOwner={true}
                onEdit={() => setEditing(true)}
                onDelete={handleDelete}
              />
            </div>
          )}

          {myReview && editing && (
            <div>
              <p style={styles.formLabel}>Editar avaliação</p>
              <ReviewForm
                initial={myReview}
                onSubmit={handleEdit}
                onCancel={() => setEditing(false)}
                submitting={submitting}
              />
            </div>
          )}

          {error && <p style={styles.errorMsg}>{error}</p>}
        </div>
      )}

      {!isLoggedIn && (
        <p style={styles.loginHint}>
          <a href="/login" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 600 }}>
            Faça login
          </a>{' '}
          para deixar sua avaliação.
        </p>
      )}

      {/* ── Lista de reviews ── */}
      <div style={styles.list}>
        {loading && <p style={styles.hint}>Carregando avaliações…</p>}

        {!loading && reviews.length === 0 && (
          <p style={styles.hint}>Nenhuma avaliação ainda. Seja o primeiro!</p>
        )}

        {reviews
          .filter((r) => r._id !== myReview?._id) // evita duplicar o meu review
          .map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              isOwner={currentUserId && review.user?._id === currentUserId}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
      </div>

      {/* ── Paginação ── */}
      {pages > 1 && (
        <div style={styles.pagination}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchReviews(p)}
              style={{
                ...styles.pageBtn,
                background: p === page ? '#f59e0b' : '#f3f4f6',
                color: p === page ? '#fff' : '#374151',
                fontWeight: p === page ? 700 : 400,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  section: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    maxWidth: 680,
    margin: '2rem auto',
    padding: '0 1rem',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '1.25rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #f3f4f6',
  },
  summary: {
    display: 'flex',
    gap: 32,
    alignItems: 'center',
    background: '#fafafa',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: '1.25rem 1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  summaryScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  bigScore: {
    fontSize: '2.8rem',
    fontWeight: 800,
    color: '#111827',
    lineHeight: 1,
  },
  totalText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  summaryBars: { flex: 1, minWidth: 180 },
  myReviewBox: {
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 12,
    padding: '1.25rem',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 4,
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 14,
    color: '#111827',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btnPrimary: {
    padding: '10px 20px',
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  btnSecondary: {
    padding: '10px 16px',
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  cardName: { fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 },
  cardTime: { fontSize: 12, color: '#9ca3af', margin: 0 },
  cardComment: { fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  hint: { color: '#9ca3af', fontSize: 14, textAlign: 'center', padding: '1rem 0' },
  loginHint: {
    fontSize: 14,
    color: '#6b7280',
    background: '#f9fafb',
    border: '1px dashed #d1d5db',
    borderRadius: 10,
    padding: '1rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  errorMsg: { color: '#ef4444', fontSize: 13, marginTop: 4 },
  pagination: { display: 'flex', gap: 8, justifyContent: 'center', marginTop: '1.5rem' },
  pageBtn: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 14,
    transition: 'background 0.2s',
  },
};
