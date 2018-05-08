import { Component, OnInit } from '@angular/core';
import { ModalService, ToastService } from '../core';
import { ArticleService, Article } from '../core/model/';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.less']
})
export class ArticlesComponent implements OnInit {
    sortOrder = 'asc';
    articles: Article[];

    constructor(private modalService: ModalService, private toastService: ToastService, private articleService: ArticleService) { }

    ngOnInit() {
        this.getArticles().subscribe((res: any) => {
            this.articles = res;
        });
    }

    openModal() {
        this.modalService.activate('This modal is a great modal').then((msg: any) => {
        this.toastService.success(msg);
        }).catch((err: any) => {
        this.toastService.warning(err);
        });
    }

    getArticles() {
        return this.articleService.getArticles();
    }

}
