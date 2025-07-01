// src/services/pasienService.js
import ApiService from './api'

/**
 * Service untuk manajemen data pasien
 * Endpoint yang diasumsikan dari backend Laravel:
 * GET    /api/pasien         - List pasien dengan pagination
 * POST   /api/pasien         - Create pasien baru
 * GET    /api/pasien/{id}    - Detail pasien
 * PUT    /api/pasien/{id}    - Update pasien
 * DELETE /api/pasien/{id}    - Delete pasien
 */
class PasienService {
  constructor() {
    this.baseUrl = '/pasien'
  }

  /**
   * Get list pasien dengan pagination dan search
   * @param {Object} params - { page, per_page, search, sort_by, sort_order }
   * @returns {Promise<Object>} Response dengan data dan pagination info
   */
  async getAll(params = {}) {
    try {
      const defaultParams = {
        page: 1,
        per_page: 10,
        search: '',
        sort_by: 'created_at',
        sort_order: 'desc'
      }
      
      const queryParams = { ...defaultParams, ...params }
      const response = await ApiService.get(this.baseUrl, queryParams)
      
      return {
        data: response.data || [],
        pagination: {
          current_page: response.current_page || 1,
          last_page: response.last_page || 1,
          per_page: response.per_page || 10,
          total: response.total || 0,
          from: response.from || 0,
          to: response.to || 0,
          links: response.links || []
        },
        meta: response.meta || {}
      }
    } catch (error) {
      console.error('Error fetching pasien:', error)
      throw error
    }
  }

  /**
   * Get detail pasien berdasarkan ID
   * @param {number|string} id - ID pasien
   * @returns {Promise<Object>} Data pasien
   */
  async getById(id) {
    try {
      const response = await ApiService.get(`${this.baseUrl}/${id}`)
      return response.data || response
    } catch (error) {
      console.error(`Error fetching pasien ${id}:`, error)
      throw error
    }
  }

  /**
   * Create pasien baru
   * @param {Object} data - Data pasien
   * @returns {Promise<Object>} Data pasien yang dibuat
   */
  async create(data) {
    try {
      // Validasi data sebelum dikirim
      this.validatePasienData(data)
      
      const response = await ApiService.post(this.baseUrl, data)
      return response.data || response
    } catch (error) {
      console.error('Error creating pasien:', error)
      throw error
    }
  }

  /**
   * Update data pasien
   * @param {number|string} id - ID pasien
   * @param {Object} data - Data pasien yang akan diupdate
   * @returns {Promise<Object>} Data pasien yang diupdate
   */
  async update(id, data) {
    try {
      // Validasi data sebelum dikirim
      this.validatePasienData(data, false)
      
      const response = await ApiService.put(`${this.baseUrl}/${id}`, data)
      return response.data || response
    } catch (error) {
      console.error(`Error updating pasien ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete pasien
   * @param {number|string} id - ID pasien
   * @returns {Promise<Object>} Response confirmation
   */
  async delete(id) {
    try {
      const response = await ApiService.delete(`${this.baseUrl}/${id}`)
      return response
    } catch (error) {
      console.error(`Error deleting pasien ${id}:`, error)
      throw error
    }
  }

  /**
   * Bulk delete pasien
   * @param {Array} ids - Array ID pasien yang akan dihapus
   * @returns {Promise<Object>} Response confirmation
   */
  async bulkDelete(ids) {
    try {
      const response = await ApiService.post(`${this.baseUrl}/bulk-delete`, { ids })
      return response
    } catch (error) {
      console.error('Error bulk deleting pasien:', error)
      throw error
    }
  }

  /**
   * Search pasien berdasarkan nama atau NIK
   * @param {string} query - Search query
   * @param {number} limit - Limit hasil search
   * @returns {Promise<Array>} Array pasien yang match
   */
  async search(query, limit = 10) {
    try {
      const params = {
        search: query,
        per_page: limit,
        page: 1
      }
      
      const response = await this.getAll(params)
      return response.data
    } catch (error) {
      console.error('Error searching pasien:', error)
      throw error
    }
  }

  /**
   * Get statistik pasien untuk dashboard
   * @returns {Promise<Object>} Statistik pasien
   */
  async getStatistics() {
    try {
      const response = await ApiService.get(`${this.baseUrl}/statistics`)
      return response.data || response
    } catch (error) {
      console.error('Error fetching pasien statistics:', error)
      throw error
    }
  }

  /**
   * Export data pasien
   * @param {string} format - Format export (excel, pdf, csv)
   * @param {Object} filters - Filter untuk export
   * @returns {Promise<Blob>} File blob
   */
  async export(format = 'excel', filters = {}) {
    try {
      const params = {
        format,
        ...filters
      }
      
      const response = await ApiService.get(`${this.baseUrl}/export`, params)
      return response
    } catch (error) {
      console.error('Error exporting pasien data:', error)
      throw error
    }
  }

  /**
   * Validasi data pasien sebelum dikirim ke server
   * @param {Object} data - Data pasien
   * @param {boolean} isCreate - Apakah untuk create (true) atau update (false)
   */
  validatePasienData(data, isCreate = true) {
    const errors = []

    if (isCreate || data.nama !== undefined) {
      if (!data.nama || data.nama.trim().length < 2) {
        errors.push('Nama minimal 2 karakter')
      }
    }

    if (isCreate || data.nik !== undefined) {
      if (!data.nik || !/^\d{16}$/.test(data.nik)) {
        errors.push('NIK harus 16 digit angka')
      }
    }

    if (data.no_hp && !/^(\+62|62|0)[0-9]{9,13}$/.test(data.no_hp)) {
      errors.push('Format nomor HP tidak valid')
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Format email tidak valid')
    }

    if (isCreate || data.tanggal_lahir !== undefined) {
      if (!data.tanggal_lahir) {
        errors.push('Tanggal lahir wajib diisi')
      }
    }

    if (data.jenis_kelamin && !['L', 'P'].includes(data.jenis_kelamin)) {
      errors.push('Jenis kelamin harus L atau P')
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
  }

  /**
   * Get form options untuk dropdown
   * @returns {Promise<Object>} Options untuk form
   */
  async getFormOptions() {
    try {
      const response = await ApiService.get(`${this.baseUrl}/form-options`)
      return response.data || {
        jenis_kelamin: [
          { value: 'L', label: 'Laki-laki' },
          { value: 'P', label: 'Perempuan' }
        ],
        agama: [
          { value: 'islam', label: 'Islam' },
          { value: 'kristen', label: 'Kristen' },
          { value: 'katolik', label: 'Katolik' },
          { value: 'hindu', label: 'Hindu' },
          { value: 'buddha', label: 'Buddha' },
          { value: 'konghucu', label: 'Konghucu' }
        ],
        golongan_darah: [
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'AB', label: 'AB' },
          { value: 'O', label: 'O' }
        ]
      }
    } catch (error) {
      // Return default options jika endpoint tidak ada
      return {
        jenis_kelamin: [
          { value: 'L', label: 'Laki-laki' },
          { value: 'P', label: 'Perempuan' }
        ]
      }
    }
  }
}

export default new PasienService()
