// GoogleGenerativeAI kütüphanesini import ediyoruz
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

// Vercel'de tanımladığınız ortam değişkeninden API anahtarını alın
// Eğer bu bir Vercel ortam değişkeni değilse, API anahtarınızı tırnaklar içine buraya yapıştırın.
// Örneğin: const API_KEY = "SİZİN_API_ANAHTARINIZ_BURAYA_GELECEK";
const API_KEY = process.env.GEMINI_API_KEY;

// Eğer API_KEY undefined ise, bir hata mesajı gösterelim
if (!API_KEY) {
    document.getElementById('output').innerHTML = '<p class="error">Hata: API Anahtarı bulunamadı veya doğru şekilde ayarlanmadı! Lütfen Vercel\'de GEMINI_API_KEY ortam değişkenini ayarladığınızdan emin olun.</p>';
    console.error("API Anahtarı bulunamadı. Lütfen Vercel'de GEMINI_API_KEY ortam değişkenini ayarlayın.");
} else {
    // API anahtarıyla Google Generative AI istemcisini başlatın
    const genAI = new GoogleGenerativeAI(API_KEY);

    async function listAvailableModels() {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '<p>Modeller yükleniyor, lütfen bekleyin...</p>';

        try {
            // API'den mevcut modelleri isteyin
            const { models } = await genAI.listModels();

            if (models.length === 0) {
                outputDiv.innerHTML = '<p>Projenizde kullanılabilir Gemini modeli bulunamadı. Lütfen Google Cloud Console\'dan Generative Language API\'nin etkinleştirildiğinden emin olun ve doğru bölgede çalıştığınızı kontrol edin.</p>';
                return;
            }

            let modelListHtml = "<h2>Mevcut Modeller:</h2><ul>";
            for (const model of models) {
                modelListHtml += `<li><strong>Model Adı:</strong> ${model.name}<br>`;
                modelListHtml += `<strong>Desteklenen Metotlar:</strong> ${model.supportedGenerationMethods ? model.supportedGenerationMethods.join(', ') : 'Yok'}<br>`;
                if (model.inputTokenLimit) modelListHtml += `<strong>Giriş Token Limiti:</strong> ${model.inputTokenLimit}<br>`;
                if (model.outputTokenLimit) modelListHtml += `<strong>Çıkış Token Limiti:</strong> ${model.outputTokenLimit}</li>`;
                modelListHtml += '</li>';
            }
            modelListHtml += "</ul>";
            outputDiv.innerHTML = modelListHtml;

        } catch (error) {
            console.error("Modeller listelenirken bir hata oluştu:", error);
            outputDiv.innerHTML = `<p class="error">Modeller listelenirken bir hata oluştu. Hata detayları: ${error.message}</p>
                                   <p class="error">Lütfen konsolu (tarayıcı geliştirici araçları) kontrol edin veya API anahtarınızın doğru olduğundan ve Generative Language API'nin projenizde etkinleştirildiğinden emin olun.</p>`;
        }
    }

    // Sayfa yüklendiğinde model listeleme fonksiyonunu çalıştır
    listAvailableModels();
}
