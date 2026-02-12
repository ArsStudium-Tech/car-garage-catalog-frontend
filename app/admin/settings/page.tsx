"use client"

import { useState, useEffect } from "react"
import { Save, Upload, X, Image as ImageIcon } from "lucide-react"
import { getSettings, updateSettings, getLogoUrl, GarageSettings } from "@/lib/api-admin"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    whatsapp: "",
    endereco: {
      logradouro: "",
      bairro: "",
      numero: "",
      cidade: "",
      estado: "",
      latitude: "",
      longitude: "",
    },
  })
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setLoadingData(true)
      const settings = await getSettings()
      setFormData({
        name: settings.name || "",
        primaryColor: settings.primaryColor || "#3B82F6",
        secondaryColor: settings.secondaryColor || "#1E40AF",
        whatsapp: settings.whatsapp || "",
        endereco: {
          logradouro: settings.endereco?.logradouro || "",
          bairro: settings.endereco?.bairro || "",
          numero: settings.endereco?.numero || "",
          cidade: settings.endereco?.cidade || "",
          estado: settings.endereco?.estado || "",
          latitude: settings.endereco?.latitude?.toString() || "",
          longitude: settings.endereco?.longitude?.toString() || "",
        },
      })
      setCurrentLogoUrl(settings.logoUrl || null)
    } catch (err: any) {
      setError("Erro ao carregar configurações")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // Prepara o objeto de endereço apenas com campos preenchidos
      const enderecoData: any = {}
      if (formData.endereco.logradouro?.trim()) enderecoData.logradouro = formData.endereco.logradouro.trim()
      if (formData.endereco.bairro?.trim()) enderecoData.bairro = formData.endereco.bairro.trim()
      if (formData.endereco.numero?.trim()) enderecoData.numero = formData.endereco.numero.trim()
      if (formData.endereco.cidade?.trim()) enderecoData.cidade = formData.endereco.cidade.trim()
      if (formData.endereco.estado?.trim()) enderecoData.estado = formData.endereco.estado.trim()
      if (formData.endereco.latitude?.trim()) {
        const lat = parseFloat(formData.endereco.latitude)
        if (!isNaN(lat)) enderecoData.latitude = lat
      }
      if (formData.endereco.longitude?.trim()) {
        const lng = parseFloat(formData.endereco.longitude)
        if (!isNaN(lng)) enderecoData.longitude = lng
      }

      await updateSettings({
        name: formData.name,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        whatsapp: formData.whatsapp,
        logo: logo || undefined,
        endereco: Object.keys(enderecoData).length > 0 ? enderecoData : undefined,
      })

      setSuccess("Configurações atualizadas com sucesso!")
      
      // Recarrega as configurações para atualizar o logo se foi enviado
      if (logo) {
        await loadSettings()
        setLogo(null)
        setLogoPreview(null)
      }
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar configurações")
    } finally {
      setLoading(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoPreview(null)
  }

  const removeCurrentLogo = async () => {
    try {
      setLoading(true)
      await updateSettings({
        logoUrl: null,
      })
      setCurrentLogoUrl(null)
      setSuccess("Logo removido com sucesso!")
    } catch (err: any) {
      setError(err.message || "Erro ao remover logo")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Configurações da Garagem</h2>
        <p className="text-muted-foreground mt-1">Gerencie as informações e aparência da sua garagem.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Informações Básicas</h3>
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Nome da Garagem *</label>
              <input
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
                placeholder="Ex: Garagem do João"
              />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Logo</h3>
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                id="logo-upload"
                className="hidden"
                disabled={loading}
              />
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl bg-muted/50 hover:bg-muted hover:border-primary transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="mb-2 text-sm font-semibold text-foreground">
                    <span className="text-primary">Clique para fazer upload</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP até 5MB</p>
                </div>
              </label>
            </div>

            {/* Logo Preview */}
            {(logoPreview || currentLogoUrl) && (
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Preview do logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : currentLogoUrl ? (
                    <img
                      src={getLogoUrl(currentLogoUrl)}
                      alt="Logo atual"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {logoPreview ? "Novo logo (será aplicado ao salvar)" : "Logo atual"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {logoPreview ? "Clique em 'Salvar Configurações' para aplicar" : "O logo aparece no site público"}
                  </p>
                </div>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="p-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
                    title="Remover novo logo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {!logoPreview && currentLogoUrl && (
                  <button
                    type="button"
                    onClick={removeCurrentLogo}
                    disabled={loading}
                    className="p-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
                    title="Remover logo atual"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Empty State */}
            {!logoPreview && !currentLogoUrl && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum logo adicionado</p>
                <p className="text-xs text-muted-foreground mt-1">Adicione um logo para personalizar sua garagem</p>
              </div>
            )}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Cores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Cor Primária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-16 h-12 rounded-lg border border-border cursor-pointer"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm font-mono"
                  placeholder="#3B82F6"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">Cor principal usada em botões e destaques</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">Cor Secundária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-16 h-12 rounded-lg border border-border cursor-pointer"
                  disabled={loading}
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm font-mono"
                  placeholder="#1E40AF"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground">Cor secundária usada em elementos complementares</p>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground">WhatsApp</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Número do WhatsApp</label>
            <input
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+5511999999999"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Número completo com código do país (ex: +5511999999999)</p>
          </div>
        </div>

        {/* Endereço */}
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Endereço</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Logradouro</label>
                <input
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                  value={formData.endereco.logradouro}
                  onChange={(e) => setFormData({
                    ...formData,
                    endereco: { ...formData.endereco, logradouro: e.target.value }
                  })}
                  placeholder="Ex: Rua das Flores"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Número</label>
                <input
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                  value={formData.endereco.numero}
                  onChange={(e) => setFormData({
                    ...formData,
                    endereco: { ...formData.endereco, numero: e.target.value }
                  })}
                  placeholder="Ex: 123"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Bairro</label>
                <input
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                  value={formData.endereco.bairro}
                  onChange={(e) => setFormData({
                    ...formData,
                    endereco: { ...formData.endereco, bairro: e.target.value }
                  })}
                  placeholder="Ex: Centro"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Cidade</label>
                <input
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                  value={formData.endereco.cidade}
                  onChange={(e) => setFormData({
                    ...formData,
                    endereco: { ...formData.endereco, cidade: e.target.value }
                  })}
                  placeholder="Ex: São Paulo"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Estado</label>
                <input
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                  value={formData.endereco.estado}
                  onChange={(e) => setFormData({
                    ...formData,
                    endereco: { ...formData.endereco, estado: e.target.value }
                  })}
                  placeholder="Ex: SP"
                  maxLength={2}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">Sigla do estado (ex: SP, RJ, MG)</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                  value={formData.endereco.latitude}
                  onChange={(e) => setFormData({
                    ...formData,
                    endereco: { ...formData.endereco, latitude: e.target.value }
                  })}
                  placeholder="Ex: -23.5505"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">Coordenada de latitude</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg focus:ring-primary focus:border-primary text-foreground text-sm"
                  value={formData.endereco.longitude}
                  onChange={(e) => setFormData({
                    ...formData,
                    endereco: { ...formData.endereco, longitude: e.target.value }
                  })}
                  placeholder="Ex: -46.6333"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">Coordenada de longitude</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 border-t border-border pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </form>
    </div>
  )
}

