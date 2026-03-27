import { useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';

export function useReviews(postId, isLoggedIn) {
  const [reviews, setReviews]           = useState([]);
  const [average, setAverage]           = useState(null);
  const [total, setTotal]               = useState(0);
  const [distribution, setDistribution] = useState([]);
  const [myReview, setMyReview]         = useState(null);
  const [loading, setLoading]           = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState(null);
  const [page, setPage]                 = useState(1);
  const [pages, setPages]               = useState(1);

  // ── Buscar lista de reviews ──────────────────────────────────────────────
  const fetchReviews = useCallback(async (p = 1) => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/posts/${postId}/reviews?page=${p}&limit=5`);
      setReviews(data.reviews);
      setAverage(data.average);
      setTotal(data.total);
      setDistribution(data.distribution);
      setPages(data.pages);
      setPage(p);
    } catch (err) {
      setError('Erro ao carregar avaliações.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // ── Buscar meu review ────────────────────────────────────────────────────
  const fetchMyReview = useCallback(async () => {
    if (!postId || !isLoggedIn) return;
    try {
      const { data } = await api.get(`/posts/${postId}/reviews/me`);
      setMyReview(data.review);
    } catch {
      // silencia: usuário pode não ter review ainda
    }
  }, [postId, isLoggedIn]);

  useEffect(() => {
    fetchReviews(1);
    fetchMyReview();
  }, [fetchReviews, fetchMyReview]);

  // ── Submeter review ──────────────────────────────────────────────────────
  const submitReview = async ({ stars, comment }) => {
    if (!isLoggedIn) return { error: 'Faça login para avaliar.' };
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post(`/posts/${postId}/reviews`, { stars, comment });
      setMyReview(data.review);
      await fetchReviews(1);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao salvar avaliação.';
      setError(msg);
      return { error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  // ── Editar review ────────────────────────────────────────────────────────
  const editReview = async (reviewId, { stars, comment }) => {
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.put(`/posts/${postId}/reviews/${reviewId}`, { stars, comment });
      setMyReview(data.review);
      await fetchReviews(page);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao editar avaliação.';
      setError(msg);
      return { error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  // ── Deletar review ───────────────────────────────────────────────────────
  const deleteReview = async (reviewId) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.delete(`/posts/${postId}/reviews/${reviewId}`);
      setMyReview(null);
      await fetchReviews(1);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao deletar avaliação.';
      setError(msg);
      return { error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews, average, total, distribution,
    myReview, loading, submitting, error,
    page, pages,
    submitReview, editReview, deleteReview,
    fetchReviews,
  };
}
