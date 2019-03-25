
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@Injectable()
export class DetailLoanService implements Resolve<any>
{
    routeParams: any;
    loan: any;
    onProductChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private apollo: Apollo){
        // Set the defaults
        this.onProductChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {   
        this.routeParams = route.params;
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getLoan()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get Loan
     *
     * @returns {Promise<any>}
     */
    getLoan(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            if(this.routeParams.id === 'new') {
                this.onProductChanged.next(false);
            } else {
                const queryAllLoans = gql`
                query {
                    bookById(bookId: ${this.routeParams.id}) {
                        id
                        title
                        author
                        year
                        edited
                        pages
                        language
                        content
                        phisicalBook {
                            numberOfCopies
                        }
                        digitalBook {
                            pathBook
                        }
                    }
                }
            `;
            
            this.apollo
                .watchQuery({
                query: queryAllLoans,
                fetchPolicy: "network-only"
                })
                .valueChanges.map((result: any) => result.data.bookById)
                .subscribe(data => {
                    this.onProductChanged.next(data);
                resolve(data)
                }, reject);
            }
        })
    }
        
}
