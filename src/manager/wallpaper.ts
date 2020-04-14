import { injectable, inject } from 'inversify';
import {
    CategoryRepository,
    WallpaperRepository
} from '../repository';
import { Scaleway } from '../datasource';
import {
    Category,
    CategoryID,
    Wallpaper,
    WallpaperID
} from '../model';

@injectable()
export class WallpaperManager {
    constructor(
        @inject(WallpaperRepository) private wallpaperRepository: WallpaperRepository,
        @inject(CategoryRepository) private categoryRepository: CategoryRepository,
        @inject(Scaleway) private scaleway: Scaleway
    ) {}

    // TODO: Implement storage operations

    async addWallpaper(wallpaper: Wallpaper): Promise<void> {
        const category = await this.checkCategory(wallpaper);

        // TODO: published only if has file formats

        // Insert wallpaper
        await this.wallpaperRepository.insert(wallpaper);

        // Update wallpaper count
        category.count++;
        await this.categoryRepository.update(category);
    }

    async updateWallpaper(wallpaper: Wallpaper): Promise<void> {
        await this.checkCategory(wallpaper);

        // TODO: same file condition as per insert

        await this.wallpaperRepository.update(wallpaper);
    }

    async getWallpapers(category: CategoryID): Promise<Wallpaper[]> {
        return this.wallpaperRepository.getByCategoryId(category);
    }

    async getWallpaper(wallpaperId: WallpaperID): Promise<Wallpaper | null> {
        return this.wallpaperRepository.get(wallpaerId);
    }

    async removeWallpaper(wallpaperId: WallpaperID): Promise<void> {
        const { id, categoryId } = wallpaperId;
        const category = await this.checkCategory(categoryId);

        await this.wallpaperRepository.delete(id);

        // Update wallpaper count
        category.count--;
        await this.categoryRepository.update(category);
    }

    private async checkCategory(wallpaperOrCategoryId: Wallpaper | CategoryID): Promise<Category> {
        let categoryId: CategoryID;
        if (typeof wallpaperOrCategoryId === 'string')
            categoryId = wallpaperOrCategoryId;
        else
            categoryId = wallpaper.categoryId;

        const category = await this.categoryRepository.get(categoryId);

        if (category == null)
            throw new Error('Unknown category');

        return category;
    }
}
