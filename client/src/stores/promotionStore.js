import { defineStore } from "pinia";
import { getLocalStorageItem } from "../../helpers";
import { createPromotionService, deletePromotionService, getAllPromotionsService, updatePromotionService } from "@/services/promotionService";

const usePromotionStore = defineStore("promotion", {
  state: () => ({
    loading: false,
    error: null,
    promotions: getLocalStorageItem('promotions') ? getLocalStorageItem('promotions') : [],
  }),
  actions: {
    async fetchPromotions() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getAllPromotionsService();
        this.promotions = data;
      } catch (error) {
        console.error(error);
        this.error = error?.message || 'Error fetching promotions';
      } finally {
        this.loading = false;
      }
    },
    async createPromotion(datas) {
      this.loading = true;
      this.error = null;
      try {
        await createPromotionService(datas.value);
        await this.fetchPromotions();
      } catch (error) {
        console.error(error);
        this.error = error?.message || 'Error creating promotion';
      } finally {
        this.loading = false;
      }
    },
    async updatePromotion(promotionData) {
      this.loading = true;
      this.error = null
      try {
        await updatePromotionService(promotionData)
        await this.fetchPromotions()
      } catch (error) {
        console.error(error);
        this.error = error?.message || 'Error updating promotion';
      } finally {
        this.loading = false
      }
    },
    async deletePromotion(id) {
      this.loading = true;
      this.error = null;
      try {
        await deletePromotionService(id)
        await this.fetchPromotions()
      } catch (error) {
        console.error(error);
        this.error = error?.message || 'Error deteleting promotion'
      }
      finally {
        this.loading = false
      }
    }
  },
});

export default usePromotionStore;
