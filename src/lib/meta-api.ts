const META_API_VERSION = 'v19.0';
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export interface MetaAdAccount {
  id: string;
  name: string;
  account_id: string;
}

export const metaApi = {
  /**
   * Obtiene la lista de cuentas publicitarias asociadas al token
   */
  async getAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
    try {
      const response = await fetch(`${BASE_URL}/me/adaccounts?fields=name,account_id&access_token=${accessToken}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error al obtener cuentas publicitarias');
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Meta API Error (getAdAccounts):', error);
      throw error;
    }
  },

  /**
   * Sube una imagen a Meta desde una URL o Base64
   */
  async uploadImage(accessToken: string, adAccountId: string, imageUrl: string): Promise<string> {
    try {
      // Para este demo, si es una URL de Supabase/External, la enviamos directamente.
      // Si es un Blob local, habría que convertirlo o subirlo como multipart.
      // Meta acepta 'url' para subir desde una URL pública.
      
      const response = await fetch(`${BASE_URL}/${adAccountId}/adimages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          access_token: accessToken,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error al subir imagen a Meta');
      }
      
      // Retornar el hash de la imagen
      const hash = Object.values(data.images)[0] as any;
      return hash.hash;
    } catch (error) {
      console.error('Meta API Error (uploadImage):', error);
      throw error;
    }
  },

  /**
   * Crea un Ad Creative (El diseño del anuncio)
   */
  async createAdCreative(
    accessToken: string, 
    adAccountId: string, 
    details: {
      name: string;
      imageHash: string;
      headline: string;
      body: string;
      link: string;
      callToAction: string;
    }
  ): Promise<string> {
    try {
      const creativeData = {
        name: `Flowsight_${details.name}_${Date.now()}`,
        object_story_spec: {
          page_id: '', // Se necesita el ID de la página, pero usualmente se saca del Ad Account
          link_data: {
            image_hash: details.imageHash,
            link: details.link,
            message: details.body,
            call_to_action: {
              type: details.callToAction.toUpperCase().replace(/\s/g, '_'),
              value: {
                link: details.link,
              },
            },
            name: details.headline,
          },
        },
        access_token: accessToken,
      };

      // Si no tenemos Page ID, Meta a veces da error. 
      // En una integración real, deberíamos dejar al usuario elegir la página.
      // Por ahora, intentaremos crear un creative "Link Data" genérico.
      
      const response = await fetch(`${BASE_URL}/${adAccountId}/adcreatives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creativeData),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error al crear Ad Creative');
      }
      
      return data.id;
    } catch (error) {
      console.error('Meta API Error (createAdCreative):', error);
      throw error;
    }
  }
};
