# Supabase — Premium codes setup

Système de codes pour accorder un accès Premium gratuit à des testeurs / amis / influenceurs, sans passer par l'IAP. Cohabite avec les achats App Store / Google Play (les deux sources sont OR'd via `CompositeSubscriptionAdapter`).

## Projet

- **URL** : `https://ogwykkdepzzrnuqdmphi.supabase.co`
- **Dashboard** : https://supabase.com/dashboard/project/ogwykkdepzzrnuqdmphi
- **Anon key** : utilisée côté app (publique par design, OK de la commit).
- **Service role key** : reste sur ta machine. Jamais commitée, jamais partagée.

## Table

```sql
create table premium_codes (
  code text primary key,
  label text,
  claimed_by_device text,
  claimed_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table premium_codes enable row level security;

create policy "anyone can read non-revoked codes"
  on premium_codes for select
  using (true);
```

## RPC — claim (atomique)

Le client n'écrit jamais directement dans la table. Cette RPC fait check + lock + update en une seule transaction, et associe le code au `device_id` du premier appareil qui l'active.

```sql
create or replace function claim_premium_code(p_code text, p_device text)
returns table (success boolean, reason text, premium boolean)
language plpgsql
security definer
as $$
declare
  v_row premium_codes%rowtype;
begin
  select * into v_row from premium_codes where code = p_code for update;

  if not found then
    return query select false, 'not_found'::text, false; return;
  end if;

  if v_row.revoked then
    return query select false, 'revoked'::text, false; return;
  end if;

  if v_row.claimed_by_device is not null and v_row.claimed_by_device <> p_device then
    return query select false, 'already_claimed'::text, false; return;
  end if;

  update premium_codes
    set claimed_by_device = p_device,
        claimed_at = coalesce(claimed_at, now())
    where code = p_code;

  return query select true, 'ok'::text, true;
end;
$$;

grant execute on function claim_premium_code(text, text) to anon;
```

## RPC — check (boot)

Appelée au démarrage de l'app pour valider qu'un code stocké localement est toujours actif et toujours associé au bon device.

```sql
create or replace function check_premium_code(p_code text, p_device text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from premium_codes
    where code = p_code
      and not revoked
      and claimed_by_device = p_device
  );
$$;

grant execute on function check_premium_code(text, text) to anon;
```

## Opérations courantes (depuis le dashboard)

### Créer un code

Table Editor → `premium_codes` → Insert row :
- `code` : ex. `FLIP-AMI-X3K9` (libre, uppercase recommandé)
- `label` : ex. `Marie (amie)` — pour t'y retrouver
- Les autres champs : laisser vides

### Révoquer un code

Toggle `revoked` → `true`. L'app refresh via Realtime ou au prochain démarrage et re-lock immédiatement.

### Détacher un code d'un device (réutiliser un code)

Vider `claimed_by_device` (set null) + vider `claimed_at`. La personne pourra le ré-activer sur un nouveau device.

### Voir qui a quel code

```sql
select code, label, claimed_by_device, claimed_at, revoked
from premium_codes
order by claimed_at desc nulls last;
```

## Realtime

Activé par défaut sur le projet. L'adapter écoute les `UPDATE` sur la ligne du code claimé — un toggle de `revoked` se répercute en quasi-temps réel sans relance de l'app.

Si tu veux désactiver Realtime (économie de quota), c'est dans Database → Replication → décocher `premium_codes`. L'adapter fallback proprement (refresh au boot uniquement).

## Sécurité — pourquoi RLS + RPC ?

- RLS lecture publique : les codes ne sont pas secrets (l'utilisateur les tape lui-même), et le client doit pouvoir lire son propre statut au boot. Pas d'info sensible exposée.
- RLS écriture interdite : pas de policy `insert/update/delete` pour `anon` → le client ne peut PAS modifier la table en direct.
- `claim` passe par une RPC `security definer` qui s'exécute avec les droits du propriétaire de la fonction. C'est la seule porte d'entrée pour écrire, et elle applique les vérifs métier (existence, revoked, déjà claimed).

Si tu voulais durcir davantage : restreindre la policy de lecture à un seul row par code via une RPC dédiée, mais c'est de l'over-engineering pour ce cas d'usage.
