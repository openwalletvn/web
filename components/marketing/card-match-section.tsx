import {Suspense} from 'react';
import type {Intent, Persona} from '@/lib/api';
import {CardMatchFinder} from '@/components/match/card-match-finder';

interface Props {
    personas: Persona[];
    intents: Intent[];
}

export function CardMatchSection({personas, intents}: Props) {
    return (
        <section className="ow-card-match-section py-12">
            <div className="ow-container">
                <div className="mb-6">
                    <h2>Thẻ nào phù hợp với bạn?</h2>
                </div>
                <Suspense>
                    <CardMatchFinder personas={personas} intents={intents}/>
                </Suspense>
            </div>
        </section>
    );
}
